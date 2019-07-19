import express from 'express';
import authenticationValidator from '../../validators/user.validator';
import PaginationValidator from '../../validators/pagination.validator';
import userController from '../../controllers/user.controller';
import authorization from '../../middlewares/auth.middleware';

const { validator, checkValidationResult } = authenticationValidator;
const {
  validator: paginationValidator,
  checkValidationResult: ValidationResult
} = PaginationValidator;
const {
  getUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  followUser,
  getFollowers
} = userController;

const { adminCheck, verifyToken, isSuperAdmin } = authorization;

const router = express.Router();

router
  .get(
    '/',
    verifyToken,
    paginationValidator()('pagination'),
    ValidationResult,
    getUsers
  )
  .get(
    '/follow/:userId',
    authenticationValidator.validator('userId'),
    verifyToken,
    getFollowers
  );
router
  .post(
    '/create_admin',
    verifyToken,
    isSuperAdmin,
    validator('signup'),
    validator('role'),
    checkValidationResult,
    adminCreateUser
  )
  .post(
    '/follow',
    verifyToken,
    authenticationValidator.validator('follow'),
    authenticationValidator.checkValidationResult,
    followUser
  );

router.put(
  '/update/:userId',
  verifyToken,
  adminCheck,
  validator('userId'),
  checkValidationResult,
  adminUpdateUser
);
router.delete(
  '/:userId',
  verifyToken,
  adminCheck,
  validator('userId'),
  checkValidationResult,
  adminDeleteUser
);
export default router;
