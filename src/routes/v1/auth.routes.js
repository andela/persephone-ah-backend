import express from 'express';
import authValidator from '../../validators/user.validator';
import authController from '../../controllers/auth.controllers';

const router = express.Router();
router
   .post(
        '/signup',
        authValidator.validator('signup'),
        authValidator.checkValidationResult,
        authController.signUp)
    .post(
        '/login',
        authValidator.validator('login'),
        authValidator.checkValidationResult,
        authController.login
    );

export default router;
