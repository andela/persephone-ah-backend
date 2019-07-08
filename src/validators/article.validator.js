import { check, validationResult } from 'express-validator';
import Helper from '../services/helper';

const ArticleValidator = {
  validator(route) {
    switch (route) {
      case 'create':
        return [
          check('title')
            .isLength({ min: 2 })
            .withMessage('Please enter your title for this post')
            .trim(),
          check('body')
            .isLength({ min: 2 })
            .withMessage('Please enter valid content for this article')
            .trim()
        ];

      case 'comment':
        return [
          check('body')
            .isLength({ min: 2 })
            .withMessage('Please comment cannot be empty')
            .trim()
        ];
      case 'delete-comment':
        return [
          check('commentId')
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
export default ArticleValidator;
