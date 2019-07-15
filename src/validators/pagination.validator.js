import { query, validationResult } from 'express-validator';
import Helper from '../services/helper';

const Validator = {
  validator(request, response, next) {
    // eslint-disable-line
    return route => {
      switch (route) {
        case 'pagination':
          return [
            query('page')
              .isNumeric()
              .withMessage('Page must be a number')
              .not()
              .matches('[-, +, %]')
              .withMessage('Page must be a positive number'),
            query('limit')
              .isNumeric()
              .withMessage('Limit must be a number')
              .not()
              .matches('[-, +, %]')
              .withMessage('Limit must be a positive number')
          ];
        default:
          return [];
      }
    };
  },

  checkValidationResult(request, response, next) {
    const result = validationResult(request);
    const { page, limit } = request.query;

    if (result.isEmpty() || !page || !limit) {
      return next();
    }
    return Helper.failResponse(response, 400, result.errors);
  }
};
export default Validator;
