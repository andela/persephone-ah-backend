import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import authenticationController from '../../controllers/auth.controllers';
import authorization from '../../middlewares/auth.middleware';
import profileUpdateCheck from '../../middlewares/profileUpdateCheck.middleware';
import upload from '../../middlewares/imageUpload.middleware';

const { validator, checkValidationResult } = authenticationValidator;
const { verifyToken } = authorization;
const { profileChecks } = profileUpdateCheck;
const {
  signUp,
  login,
  forgotPassword,
  passwordReset,
  profileUpdate
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

router.put(
  '/profileupdate',
  verifyToken,
  upload.single('image'),
  profileChecks,
  profileUpdate
);

export default router;
