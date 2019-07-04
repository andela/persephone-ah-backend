import express from 'express';
import authentication from '../../middlewares/auth.middleware';
import userController from '../../controllers/user.controller';

const router = express.Router();

router.get('/', authentication.verifyToken, userController.getUsers);

export default router;
