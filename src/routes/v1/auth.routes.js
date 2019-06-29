import express from  'express';
import authValidator from '../../validators/user.validator'
import authController from '../../controllers/auth.controllers';

const router = express.Router();

router.post('/signup', authValidator.signUpValidator, authController.signUp);

export default router;