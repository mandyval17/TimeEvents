import express from 'express';
import MessageResponse from '../interfaces/message-response';
import emojis from './emojis';
import { eventGetter } from './event-getter/router';
import './cron-job/enqueue';
import './cron-job/fall-back-queue';

const router = express.Router();


router.get<{}, MessageResponse>('/ping', (req, res) => {
  res.json({
    data: null,
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

router.use('/event', eventGetter);

// router.use('/report', report);
export default router;
