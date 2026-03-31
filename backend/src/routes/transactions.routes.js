// src/routes/transactions.routes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getTransactions, getTransaction, createTransaction,
  updateTransaction, deleteTransaction,
  getMonthlySummary, getCategorySummary,
  getBalance,                               // NEW
} from '../controllers/transactions.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/',                     asyncHandler(getTransactions));
router.post('/',                    asyncHandler(createTransaction));

// Summary routes — must come before /:id to avoid route shadowing
router.get('/summary/monthly',      asyncHandler(getMonthlySummary));
router.get('/summary/categories',   asyncHandler(getCategorySummary));
router.get('/summary/balance',      asyncHandler(getBalance));       // NEW

router.get('/:id',                  asyncHandler(getTransaction));
router.patch('/:id',                asyncHandler(updateTransaction));
router.delete('/:id',               asyncHandler(deleteTransaction));

export default router;
