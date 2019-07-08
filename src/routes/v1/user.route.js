import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import userController from '../../controllers/user.controller';
import authorization from '../../middlewares/auth.middleware';

const { validator, checkValidationResult } = authenticationValidator;
const {
  getUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser
} = userController;

const { adminCheck, verifyToken, isSuperAdmin } = authorization;

const router = express.Router();

router
  .get('/', verifyToken, getUsers)
  .post(
    '/create_admin',
    verifyToken,
    isSuperAdmin,
    validator('signup'),
    validator('role'),
    checkValidationResult,
    adminCreateUser
  )
  .put(
    '/update/:userId',
    verifyToken,
    adminCheck,
    validator('userId'),
    checkValidationResult,
    adminUpdateUser
  )
  .delete(
    '/:userId',
    verifyToken,
    adminCheck,
    validator('userId'),
    checkValidationResult,
    adminDeleteUser
  );
export default router;
