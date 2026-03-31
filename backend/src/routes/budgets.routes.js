// src/routes/budgets.routes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../controllers/budgets.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/',      asyncHandler(getBudgets));
router.post('/',     asyncHandler(createBudget));
router.patch('/:id', asyncHandler(updateBudget));
router.delete('/:id',asyncHandler(deleteBudget));

export default router;
