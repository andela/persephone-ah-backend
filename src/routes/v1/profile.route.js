import express from 'express';
import userController from '../../controllers/user.controller';
import authorization from '../../middlewares/auth.middleware';

const { verifyToken } = authorization;
const { viewProfile } = userController;
const router = express.Router();
router.get('/:username', verifyToken, viewProfile);
export default router;
