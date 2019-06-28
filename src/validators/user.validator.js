import Helper from '../services/helper';
const {
  check,
  validationResult,
  validationErrors
} = require('express-validator');

const UserValidator = {
  signUpValidator(request, response, next) {
    if (request.body.password !== request.body.confirmPassword) {
      const error = 'passwords must match';
      return Helper.errorResponse(response, 422, error);
    }
    request
      .check('firstName')
      .isAlpha()
      .withMessage('First name must be only alphabetical chars')
      .isLength({ min: 2 })
      .withMessage('Please enter your first name')
      .trim();
    request
      .check('lastName')
      .isAlpha()
      .withMessage('Last name must be only alphabetical chars')
      .isLength({ min: 2 })
      .withMessage('Please enter your last name')
      .trim();
    request
      .check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .trim();
    request
      .check('password')
      .not()
      .isEmpty()
      .isLength({ min: 8 })
      .withMessage('Pasword can not be less than 8 characters')
      .matches('[0-9]')
      .withMessage('Password must contain a number')
      .matches('[A-Z]')
      .withMessage('Password must contain an upper case letter');
    const errors = request.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(response, 422, err);
    }
    return next();
  },

  signInValidator(request, response, next) {
    request
      .check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .trim();
    request
      .check('password')
      .not()
      .isEmpty()
      .withMessage('Pasword can not be empty')
      .isLength({ min: 8 })
      .withMessage('Pasword can not be less than 8 characters');

    const errors = request.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(response, 422, err);
    }
    return next();
  },

  passwordValidator(request, response, next) {
    if (request.body.oldPassword === request.body.password) {
      const error = 'you have used this password earlier';
      return Helper.errorResponse(response, 422, error);
    }
    if (request.body.password !== request.body.confirmPassword) {
      const error = 'passwords must match';
      return Helper.errorResponse(response, 422, error);
    }
    request
      .check('password')
      .not()
      .isEmpty()
      .isLength({ min: 8 })
      .withMessage('Pasword can not be less than 8 characters')
      .matches('[0-9]')
      .withMessage('Password must contain a number')
      .matches('[A-Z]')
      .withMessage('Password must contain an upper case letter');
    const errors = request.validationErrors();
    if (errors) {
      const err = Helper.validationError(errors);
      return Helper.errorResponse(response, 422, err);
    }
    return next();
  }
};
export default UserValidator;
