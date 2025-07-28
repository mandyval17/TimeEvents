import { prisma } from '../../utils/prisma-client';
import { eventQueue, redisClient } from '../../utils/redis-client';

export const handleRealTimeGeneration = async (date: string, time: string) => {
  const GENERATING_KEY = `generating:${date}:${time}`;
  const LOCK_KEY = `lock:${date}:${time}`;
  const LOCK_TIMEOUT = 30;

  try {
    await redisClient.setEx(GENERATING_KEY, 60, 'true');
    const lockAcquired = await redisClient.set(LOCK_KEY, '1', {
      EX: LOCK_TIMEOUT,
      NX: true,
    });

    if (lockAcquired) {
      await eventQueue.add('generate-event', { date, time }, {
        jobId: `${date}:${time}`,
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: true,
        backoff: { type: 'exponential', delay: 2000 },
      });
      return { status: 202, message: 'Generating event now. Please check back in 5 seconds.' };
    }
    return { status: 503, message: 'System busy. Please try again shortly.' };
  } catch (err) {
    await prisma.eventQueueFallback.create({ data: { queuedAt: new Date(), payload: { date, time }, error: err as string } });
    return { status: 500, message: 'Generation request failed' };
  }
};