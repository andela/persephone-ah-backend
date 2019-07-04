import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import authenticationController from '../../controllers/auth.controllers';
import AuthenticationToken from '../../middlewares/auth.middleware';
import profileUpdateCheck from '../../middlewares/profileUpdateCheck.middleware';
import upload from '../../middlewares/imageUpload.middleware';
const { login, signUp, profileUpdate } = authenticationController;
const { validator, checkValidationResult } = authenticationValidator;
const { verifyToken } = AuthenticationToken;
const { profileChecks } = profileUpdateCheck;

const router = express.Router();
router
  .post('/signup', validator('signup'), checkValidationResult, signUp)
  .post('/login', validator('login'), checkValidationResult, login);
router.put(
  '/profileupdate',
  verifyToken,
  upload.single('image'),
  profileChecks,
  profileUpdate
);

export default router;
