import { check, validationResult } from 'express-validator';
import Helper from '../services/helper';

const reactionValidator = {
  validator(route) {
    switch (route) {
      case 'article':
        return [
          check('reaction')
            .not()
            .isEmpty()
            .isAlpha()
            .isIn(['dislike', 'like'])
            .withMessage('Please enter a valid reaction')
            .trim()
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
export default reactionValidator;
