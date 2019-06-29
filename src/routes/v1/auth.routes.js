import express from  'express';
import authValidator from '../../validators/user.validator'
import authController from '../../controllers/auth.controllers';

const router = express.Router();

router.post('/signup', authController.signUp);

export default router;