
import { Router } from 'express';
import { getEvent } from './handlers/get-event';
import { enqueueDailyEvents } from '../cron-job/enqueue';


const router = Router();


router.post('/:hours/:minutes', getEvent);

router.get('/test-daily-jobs', enqueueDailyEvents);

export const eventGetter = router;