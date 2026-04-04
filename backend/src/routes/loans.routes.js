import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getLoans,
  createLoan,
  updateLoan,
  deleteLoan
} from '../controllers/loans.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getLoans));
router.post('/', asyncHandler(createLoan));
router.patch('/:id', asyncHandler(updateLoan));
router.delete('/:id', asyncHandler(deleteLoan));

export default router;
