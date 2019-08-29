import express from 'express';
import notificationController from '../../controllers/notification.controller';
import authorization from '../../middlewares/auth.middleware';

const { verifyToken } = authorization;
const { fetchNotification, readNotification } = notificationController;
const router = express.Router();
router.get('/', verifyToken, fetchNotification);
router.put('/:notificationId', verifyToken, readNotification);
export default router;
