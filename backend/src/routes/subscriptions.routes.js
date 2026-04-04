import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from '../controllers/subscriptions.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getSubscriptions));
router.post('/', asyncHandler(createSubscription));
router.patch('/:id', asyncHandler(updateSubscription));
router.delete('/:id', asyncHandler(deleteSubscription));

export default router;
