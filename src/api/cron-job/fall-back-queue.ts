import cron from 'node-cron';
import { Queue as BullQueue } from 'bullmq';
import { env } from '../../env';
import { prisma } from '../utils/prisma-client';


const fallbackQueue = new BullQueue('daily-events', { connection: { url: env.REDIS_URL } });

// Run every 5 minutes to retry fallback entries
cron.schedule('*/1 * * * *', async () => {
  const entries = await prisma.eventQueueFallback.findMany({ take: 100 });
  for (const entry of entries) {
    try {
      if (
        entry.payload &&
        typeof entry.payload === 'object' &&
        'date' in entry.payload &&
        'time' in entry.payload
      ) {
        await fallbackQueue.add('generate-event', entry.payload, {
          jobId: `${(entry.payload as any).date}:${(entry.payload as any).time}`,
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
          backoff: { type: 'exponential', delay: 60000 },
        });
      }
      // Remove on success
      await prisma.eventQueueFallback.delete({ where: { id: entry.id } });
    } catch (err) {
      console.warn(`Retry failed for fallback id=${entry.id}:`, err);
    }
  }
  console.log(`Processed ${entries.length} fallback entries`);
});
