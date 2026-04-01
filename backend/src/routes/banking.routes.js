// src/routes/banking.routes.js
import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import {
  gocardlessCreateLink,
  gocardlessConfirmLink,
  gocardlessSyncTransactions,
  uploadCSVStatement,
  getBankStatus,
} from '../controllers/banking.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes require authentication
router.use(requireAuth);

// ── Status ────────────────────────────────────────────────────────
router.get('/status', getBankStatus);

// ── GoCardless (EU / UK / Free) ──────────────────────────────────
router.post('/gocardless/create-link', gocardlessCreateLink);
router.post('/gocardless/confirm-link', gocardlessConfirmLink);
router.post('/gocardless/sync', gocardlessSyncTransactions);

// ── Manual CSV Upload ─────────────────────────────────────────────
router.post('/upload-csv', upload.single('statement'), uploadCSVStatement);

export default router;
