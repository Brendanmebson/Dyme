// src/routes/banking.routes.js
import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import {
  uploadStatement,
  getBankStatus,
} from '../controllers/banking.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes require authentication
router.use(requireAuth);

// ── Status ────────────────────────────────────────────────────────
router.get('/status', getBankStatus);

// ── Universal Statement Upload (CSV, XLSX, XLS) ───────────────────
router.post('/upload-csv', upload.single('statement'), uploadStatement);

// ── Disconnect ────────────────────────────────────────────────────
router.delete('/disconnect', disconnectBank);

export default router;
