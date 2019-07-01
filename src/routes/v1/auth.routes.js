import express from 'express';
import authValidator from '../../validators/user.validator';
import authController from '../../controllers/auth.controllers';
import auth from '../../middlewares/auth.middlewares';

const { validator } = authValidator;
const { checkValidationResult } = authValidator;

const router = express.Router();
router
  .post(
    '/signup',
    validator('signup'),
    checkValidationResult,
    authController.signUp
  )
  .post(
    '/login',
    validator('login'),
    checkValidationResult,
    authController.login
  )
  .post(
    '/forgot_password',
    validator('forgotPassword'),
    checkValidationResult,
    authController.forgotPassword
  )
  .patch(
    '/password_reset',
    auth.verifyPasswordResetToken,
    validator('resetPassword'),
    checkValidationResult,
    authController.passwordReset
  );

export default router;
