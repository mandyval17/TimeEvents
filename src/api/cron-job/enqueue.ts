// import cron from 'node-cron';
import { BackoffOptions, Queue } from 'bullmq';
import { env } from '../../env';
import { prisma } from '../utils/prisma-client';
import cron from 'node-cron';

const eventQueue = new Queue('daily-events', { connection: { url: env.REDIS_URL } });


export async function enqueueDailyEvents() {
  const date = new Date().toISOString().slice(0, 10);
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m++) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const jobId = `${date}:${time}`;
      try {
        await eventQueue.add('generate-event', { date, time }, {
          jobId,
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
          backoff: { type: 'exponential', delay: 60000 } as BackoffOptions,
        });
      } catch (err) {
        console.warn(`Enqueue failed for ${jobId}:`, err);
        await prisma.eventQueueFallback.create({ data: { queuedAt: new Date(), payload: { date, time }, error: err as string } });
      }
    }
  }
  console.log('✅ Enqueued or stored 1440 jobs');
}

cron.schedule('0 0 * * *', () => {
  console.log('🕛 Running daily event enqueue at midnight');
  enqueueDailyEvents().catch(err => {
    console.error('Failed to enqueue daily events:', err);
  });
}, {
  timezone: 'Asia/Kolkata',
});

