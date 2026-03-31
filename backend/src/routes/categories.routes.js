// src/routes/categories.routes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/',       asyncHandler(getCategories));
router.post('/',      asyncHandler(createCategory));
router.patch('/:id',  asyncHandler(updateCategory));  // NEW
router.delete('/:id', asyncHandler(deleteCategory));

export default router;
