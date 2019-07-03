import express from 'express';
import authentication from '../../middlewares/auth.middleware';
import userController from '../../controllers/user.controller';
import tryCatch from '../../helpers/tryCatch.helper';

const router = express.Router();

router.get('/', authentication.verifyToken, tryCatch(userController.getUsers));

export default router;
