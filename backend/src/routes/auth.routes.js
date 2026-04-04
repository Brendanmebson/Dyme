// src/routes/auth.routes.js
import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/auth.js';
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
  updateAvatar,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));

// Protected routes
router.get('/me', requireAuth, asyncHandler(getMe));
router.patch('/me', requireAuth, asyncHandler(updateMe));
router.post('/avatar', requireAuth, asyncHandler(updateAvatar));
router.post('/change-password', requireAuth, asyncHandler(changePassword));

export default router;