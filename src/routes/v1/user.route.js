import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import userController from '../../controllers/user.controller';
import authenticationMiddleware from '../../middlewares/auth.middleware';

const { verifyToken, isSuperAdmin, adminCheck } = authenticationMiddleware;

const router = express.Router();
router
  .post(
    '/create_admin',
    verifyToken,
    isSuperAdmin,
    authenticationValidator.validator('signup'),
    authenticationValidator.validator('role'),
    authenticationValidator.checkValidationResult,
    userController.adminCreateUser
  )
  .put(
    '/update/:userId',
    verifyToken,
    adminCheck,
    authenticationValidator.validator('userId'),
    authenticationValidator.checkValidationResult,
    userController.adminUpdateUser
  )
  .delete(
    '/:userId',
    verifyToken,
    adminCheck,
    authenticationValidator.validator('userId'),
    authenticationValidator.checkValidationResult,
    userController.adminDeleteUser
  );

export default router;
