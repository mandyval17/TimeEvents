// src/api/bullBoard.ts
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { env } from '../env';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';



const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/admin/queues');

const eventQueue = new Queue('daily-events', {
  connection: { url: env.REDIS_URL },
});



createBullBoard({
  queues: [new BullMQAdapter(eventQueue)],
  serverAdapter,
});

export default serverAdapter;
