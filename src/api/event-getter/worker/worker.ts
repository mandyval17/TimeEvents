// import { Job, Worker } from 'bullmq';
// import { env } from '../../../env';
// import { getWikipediaImage } from '../services/get-wikepidea-image';
// import { redisClient } from '../../utils/redis-client';
// import { prisma } from '../../utils/prisma-client';
// import { generateEventContent } from '../services/content-generation-helper';
// import { EventMatcher } from '../services/event-matching-helper';

// const connection = { url: env.REDIS_URL };
// const MAX_RETRIES = 5;

// const worker = new Worker(
//   'daily-events',
//   async (job: Job) => {
//     const { date, time } = job.data as { date: string; time: string };
//     const redisKey = `events:${date}:${time}`;
//     const generatingKey = `generating:${date}:${time}`;

//     const exists = await prisma.dailyEvent.findUnique({
//       where: { eventDate_timeStr: { eventDate: new Date(date), timeStr: time } },
//     });
//     if (exists) return;

//     for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
//       try {
//         let ev = await generateEventContent(time);
//         console.log('timeStr', time);
//         const recentEvents = await prisma.dailyEvent.findMany({
//           where: { timeStr: time },
//         });
//         // console.log('hellp');
//         if (await EventMatcher.isSimilarEvent(ev, recentEvents)) {
//           console.log('already exists');
//           continue;
//         }
//         // console.log('h');

//         const imageUrl = await getWikipediaImage(ev.wikiLink);
//         await prisma.dailyEvent.create({
//           data: {
//             eventDate: new Date(date),
//             timeStr: time,
//             title: ev.title,
//             description: ev.description,
//             wikiLink: ev.wikiLink,
//             imageUrl: imageUrl ?? 'hello',
//             exactTime: ev.exactTime,
//             exactDate: new Date(ev.exactDate),
//           },
//         });

//         const payload = { date, time, ...ev, imageUrl };
//         await redisClient.del(generatingKey);
//         await redisClient.setEx(redisKey, 24 * 3600, JSON.stringify(payload));
//         return;

//       } catch (error) {
//         console.error(`Attempt ${attempt} failed for job ${job.id}:`, error);
//         if (attempt === MAX_RETRIES) {
//           await redisClient.del(generatingKey);
//         }

//       }

//     }
//     console.error(`Job ${job.id} failed after ${MAX_RETRIES} attempts`);
//   },
//   { connection },
// );

// worker.on('failed', async (job: Job | undefined, err: Error) => {
//   if (!job) {
//     console.error('Job is undefined in failed event:', err);
//     return;
//   }
//   console.error(`Job ${job.id} permanently failed:`, err);

//   await prisma.eventQueueFallback.create({
//     data: {
//       queuedAt: new Date(),
//       payload: job.data ?? {},
//       error: err?.message ?? String(err),
//     },
//   });
// });
