import { check, validationResult, param } from 'express-validator';
import Helper from '../services/helper';

const UserValidator = {
  validator(route) {
    switch (route) {
      case 'signup':
        return [
          check('firstName')
            .isAlpha()
            .withMessage('First name must be only alphabetical chars')
            .isLength({ min: 2 })
            .withMessage('Please enter your first name')
            .trim(),
          check('lastName')
            .isAlpha()
            .withMessage('Last name must be only alphabetical chars')
            .isLength({ min: 2 })
            .withMessage('Please enter your last name')
            .trim(),
          check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .trim(),
          check('password')
            .not()
            .isEmpty()
            .isLength({ min: 8 })
            .withMessage('Password can not be less than 8 characters')
            .matches('[0-9]')
            .withMessage('Password must contain a number')
            .matches('[A-Z]')
            .withMessage('Password must contain an upper case letter')
        ];

      case 'login':
        return [
          check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .trim(),
          check('password')
            .not()
            .isEmpty()
            .withMessage('Password can not be empty')
            .isLength({ min: 8 })
            .withMessage('Password can not be less than 8 characters')
        ];

      case 'forgotPassword':
        return [
          check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .trim()
        ];
      case 'resetPassword':
        return [
          check('password')
            .not()
            .isEmpty()
            .isLength({ min: 8 })
            .withMessage('Password can not be less than 8 characters')
            .matches('[0-9]')
            .withMessage('Password must contain a number')
            .matches('[A-Z]')
            .withMessage('Password must contain an upper case letter')
        ];

      case 'role':
        return [
          check('role')
            .isIn(['admin', 'super_admin'])
            .withMessage('Please select an appropriate role type')
        ];

      case 'userId':
        return [
          param('userId')
            .isNumeric()
            .not()
            .matches('[-, +, %]')
            .withMessage('User ID must be a number')
        ];

      default:
    }
  },

  checkValidationResult(request, response, next) {
    const result = validationResult(request);
    if (result.isEmpty()) {
      return next();
    }
    return Helper.failResponse(response, 400, result.errors);
  }
};
export default UserValidator;
