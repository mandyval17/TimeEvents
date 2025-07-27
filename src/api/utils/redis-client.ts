import { createClient } from 'redis';
import { env } from '../../env';
export const redisClient = createClient({
  url: env.REDIS_URL,    // your rediss://… URL
});

redisClient
  .connect()
  .then(() => console.log('🔌 node-redis connected'))
  .catch(console.error);