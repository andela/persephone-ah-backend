import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import authenticationController from '../../controllers/auth.controllers';

const router = express.Router();
router
  .post(
    '/signup',
    authenticationValidator.validator('signup'),
    authenticationValidator.checkValidationResult,
    authenticationController.signUp
  )
  .post(
    '/login',
    authenticationValidator.validator('login'),
    authenticationValidator.checkValidationResult,
    authenticationController.login
  );

export default router;
