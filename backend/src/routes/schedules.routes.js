import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/schedules.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getSchedules));
router.post('/', asyncHandler(createSchedule));
router.patch('/:id', asyncHandler(updateSchedule));
router.delete('/:id', asyncHandler(deleteSchedule));

export default router;
