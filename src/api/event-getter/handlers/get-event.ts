import { Request, Response, NextFunction } from 'express';
import MessageResponse from '../../../interfaces/message-response';
import { redisClient } from '../../utils/redis-client';
import { prisma } from '../../utils/prisma-client';
import { handleRealTimeGeneration } from '../services/realtime-generation-helper';

type GetEventRequest = Request<{ hours: string, minutes: string }>;


export const getEvent = async (req: GetEventRequest, res: Response<MessageResponse>, next: NextFunction) => {
  try {

    const date = new Date().toISOString().slice(0, 10);
    console.log(date);
    const time = `${req.params.hours.padStart(2, '0')}:${req.params.minutes.padStart(2, '0')}`;
    const redisKey = `events:${date}:${time}`;
    const generatingKey = `generating:${date}:${time}`;

    const cached = await redisClient.get(redisKey);
    if (typeof cached === 'string') return res.json(JSON.parse(cached));

    const isGenerating = await redisClient.get(generatingKey);
    if (isGenerating) {
      return res.status(202).json({
        message: 'Event is being generated. Please wait...',
        data: null,
      });
    }

    // 2) Fallback to Postgres
    const ev = await prisma.dailyEvent.findUnique({
      where: { eventDate_timeStr: { eventDate: new Date(date), timeStr: time } },
    });
    if (!ev) {
      const generationResponse = await handleRealTimeGeneration(date, time);
      return res.status(generationResponse.status).json({
        message: generationResponse.message,
        data: null,
      });
      // return res.status(404).json({ message: 'Event not found', data: null });
    }

    const payload = {
      date,
      time,
      title: ev.title,
      description: ev.description,
      wikiLink: ev.wikiLink,
      imageUrl: ev.imageUrl,
      exactTime: ev.exactTime,
      exactDate: ev.exactDate.toISOString().slice(0, 10),
    };

    await redisClient.setEx(redisKey, 24 * 3600, JSON.stringify(payload));
    res.json({
      message: 'Event found',
      data: payload,
    });


  } catch (err) {
    next(err);
  }
};
