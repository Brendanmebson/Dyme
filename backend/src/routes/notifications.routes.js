// src/routes/notifications.routes.js
import { Router } from 'express';
import * as NotificationsController from '../controllers/notifications.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', NotificationsController.getNotifications);
router.post('/sync', NotificationsController.syncNotifications);
router.patch('/:id', NotificationsController.updateNotification);
router.delete('/:id', NotificationsController.deleteNotification);

export default router;
