import express from 'express';
import notificationController from '../../controllers/notification.controller';
import authorization from '../../middlewares/auth.middleware';

const { verifyToken } = authorization;
const { fetchNotification } = notificationController;
const router = express.Router();
router.get('/', verifyToken, fetchNotification);
export default router;
