import express from 'express';
import MessageResponse from '../interfaces/message-response';
import { eventGetter } from './event-getter/router';
import './cron-job/enqueue';
import './cron-job/fall-back-queue';
// import './../api/event-getter/worker/worker';

const router = express.Router();


router.get<{}, MessageResponse>('/ping', (req, res) => {
  res.json({
    data: null,
    message: 'API - 👋🌎🌍🌏',
  });
});


router.use('/event', eventGetter);

// router.use('/report', report);
export default router;
