// import { createClient } from 'redis';
// import { env } from '../../env';
// import { Queue } from 'bullmq';
// export const redisClient = createClient({
//   url: env.REDIS_URL!,    // your rediss://… URL
// });

// export const eventQueue = new Queue('daily-events', { connection: { url: env.REDIS_URL } });

// redisClient
//   .connect()
//   .then(() => console.log('🔌 node-redis connected'))
//   .catch(console.error);