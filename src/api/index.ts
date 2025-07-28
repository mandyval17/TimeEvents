import express, { Request, Response } from 'express';
import MessageResponse from '../interfaces/message-response';
import { eventGetter } from './event-getter/router';
import './cron-job/enqueue';
import './cron-job/fall-back-queue';
import { loadModel } from './event-getter/services/event-matching-helper';
// import './../api/event-getter/worker/worker';

const router = express.Router();


router.get<{}, MessageResponse>('/ping', (req: Request, res: Response) => {
  res.json({
    data: null,
    message: 'API - 👋🌎🌍🌏',
  });
});

loadModel().then(() => console.log('AI model ready'));

router.use('/event', eventGetter);

// router.use('/report', report);
export default router;
