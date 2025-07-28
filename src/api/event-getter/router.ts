
import { Router } from 'express';
import { getEvent } from './handlers/get-event';


const router = Router();


router.post('/:hours/:minutes', getEvent);


export const eventGetter = router;