import { Request, Response, NextFunction } from 'express';
import MessageResponse from '../../../interfaces/message-response';
import { prisma } from '../../utils/prisma-client';
import { escapeHtml, generateHtmlPage } from '../services/generate-html';
import { getWikipediaImage } from '../services/get-wikepidea-image';
import { generateEventContent } from '../services/content-generation-helper';
import { EventMatcher } from '../services/event-matching-helper';
import { DailyEvent } from '@prisma/client';

type GetEventRequest = Request<{ hours: string, minutes: string }>;


export const getEvent = async (req: GetEventRequest, res: Response<MessageResponse>, next: NextFunction) => {
  try {

    const date = new Date().toISOString().slice(0, 10);
    const time = `${req.params.hours.padStart(2, '0')}:${req.params.minutes.padStart(2, '0')}`;

    let event = await prisma.dailyEvent.findUnique({
      where: { eventDate_timeStr: { eventDate: new Date(date), timeStr: time } },
    });

    if (event) {
      const html = generateHtmlPage(event);
      return res.json({
        message: 'Event found',
        data: html,
      });
    }

    const recentEvents = await prisma.dailyEvent.findMany({
      where: { timeStr: time },
    });
    let generatedData = await generateEventContent(time);
    let imageUrl = await getWikipediaImage(generatedData.wikiLink);
    let isDuplicate = await EventMatcher.isSimilarEvent(generatedData as DailyEvent, recentEvents);

    if (isDuplicate) {
      for (let attempt = 1; attempt <= 5; attempt++) {
        generatedData = await generateEventContent(time);
        imageUrl = await getWikipediaImage(generatedData.wikiLink);
        isDuplicate = await EventMatcher.isSimilarEvent(generatedData as DailyEvent, recentEvents);
        if (!isDuplicate) break;
      }
    }
    try {
      event = await prisma.dailyEvent.create({
        data: {
          eventDate: new Date(date),
          timeStr: time,
          title: generatedData.title,
          description: generatedData.description,
          wikiLink: generatedData.wikiLink,
          imageUrl: imageUrl,
          exactTime: generatedData.exactTime,
          exactDate: new Date(generatedData.exactDate),
        },
      });
    } catch (err) {
      return res.status(409).json({
        message: 'Error inserting Data',
        data: null,
      });
    }

    const html = generateHtmlPage(event);

    res.json({
      message: 'Event found',
      data: html,
    });


  } catch (err) {
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body>
        <h1>Event Generation Failed</h1>
        <p>We couldn't generate the requested event. Please try again later.</p>
        <p>${escapeHtml((err as Error).message)}</p>
      </body>
      </html>
    `;
    res.status(500).json({
      message: 'Event Generation Failed',
      data: errorHtml,
    });
  }
};
