import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import authenticationController from '../../controllers/auth.controllers';

import authorization from '../../middlewares/auth.middleware';

const { validator, checkValidationResult } = authenticationValidator;

const router = express.Router();
router
  .post(
    '/signup',
    validator('signup'),
    checkValidationResult,
    authenticationController.signUp
  )
  .post(
    '/login',
    validator('login'),
    checkValidationResult,
    authenticationController.login
  )
  .post(
    '/forgot_password',
    validator('forgotPassword'),
    checkValidationResult,
    authenticationController.forgotPassword
  )
  .patch(
    '/password_reset',
    authorization.verifyPasswordResetToken,
    validator('resetPassword'),
    checkValidationResult,
    authenticationController.passwordReset
  );

export default router;
