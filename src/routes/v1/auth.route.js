import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import authenticationController from '../../controllers/auth.controllers';
import authorization from '../../middlewares/auth.middleware';
import profileUpdateCheck from '../../middlewares/profileUpdateCheck.middleware';
import upload from '../../middlewares/imageUpload.middleware';

const { validator, checkValidationResult } = authenticationValidator;
const { verifyToken, verifyPasswordResetToken } = authorization;
const { profileChecks } = profileUpdateCheck;
const {
  signUp,
  login,
  forgotPassword,
  passwordReset,
  profileUpdate,
  logout,
  verifyEmail
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
    verifyPasswordResetToken,
    validator('resetPassword'),
    checkValidationResult,
    passwordReset
  )
  .get('/logout', verifyToken, logout);

router.put(
  '/',
  verifyToken,
  upload.single('image'),
  profileChecks,
  profileUpdate
);
router.get('/verify/:confirmEmailCode', verifyEmail);

export default router;
