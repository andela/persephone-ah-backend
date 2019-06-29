import Helper from '../services/helper';
import { body, check, validationResult } from 'express-validator';
import model from '../db/models';
const { User } = model;

const UserValidator = {
  signUpValidator(route) {
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
            .withMessage('Pasword can not be less than 8 characters')
            .matches('[0-9]')
            .withMessage('Password must contain a number')
            .matches('[A-Z]')
            .withMessage('Password must contain an upper case letter'),
          body('email').custom(value => {
              return User.findOne({where: { 'email': value }})
              .then(user => {
                if (user) {
                  return Promise.reject('E-mail already in use');
                }
              })
            })
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
            .withMessage('Pasword can not be empty')
            .isLength({ min: 8 })
            .withMessage('Pasword can not be less than 8 characters')
        ];

      case 'passwordReset':
        return [
          check('password')
            .not()
            .isEmpty()
            .isLength({ min: 8 })
            .withMessage('Pasword can not be less than 8 characters')
            .matches('[0-9]')
            .withMessage('Password must contain a number')
            .matches('[A-Z]')
            .withMessage('Password must contain an upper case letter')
        ];

      default:
        return [];
    }
  },

  checkValidationResult(request, response, next) {
    
    const result = validationResult(request);
    if (result.isEmpty()) {
      return next();
    }
    return Helper.errorResponse(response, 422, result.errors);
  }
};
export default UserValidator;
