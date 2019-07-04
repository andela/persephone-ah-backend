import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import authenticationController from '../../controllers/auth.controllers';
import authorization from '../../middlewares/auth.middleware';

const { validator, checkValidationResult } = authenticationValidator;
const {
  signUp,
  login,
  forgotPassword,
  passwordReset
} = authenticationController;

const router = express.Router();
router
  .post('/signup', validator('signup'), checkValidationResult, signUp)
  .post('/login', validator('login'), checkValidationResult, login)
  .post(
    '/forgot_password',
    validator('forgotPassword'),
    checkValidationResult,
    forgotPassword
  )
  .patch(
    '/password_reset',
    authorization.verifyPasswordResetToken,
    validator('resetPassword'),
    checkValidationResult,
    passwordReset
  );

export default router;
