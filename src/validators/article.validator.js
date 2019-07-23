import { check, validationResult, param } from 'express-validator';
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
      case 'rating':
        return [
          check('articleId')
            .isNumeric()
            .isInt({ gt: 0 })
            .withMessage('Article ID must be greater than 0')
            .not()
            .matches('[-, +, %]')
            .withMessage('Article ID must be a number'),
          check('rating')
            .isNumeric()
            .isInt({ gt: 0 })
            .withMessage('Rating must be greater than 0')
            .not()
            .matches('[-, +, %]')
            .withMessage('Rating must be a number'),
          check('rating')
            .not()
            .isInt({ gt: 5 })
            .withMessage('Rating cannot be greater than 5')
        ];

      case 'fetchRating':
        return [
          param('articleId')
            .isNumeric({ gt: 0 })
            .not()
            .not()
            .matches('[-, +, %]')
            .withMessage(
              'Article ID must be a number and can not be less than 1'
            )
        ];
      case 'remove-article':
        return [
          check('reason')
            .isLength({ min: 2 })
            .withMessage('Please reason cannot be empty')
            .trim()
        ];
      case 'commentLike':
        return [
          param('commentId')
            .isNumeric()
            .isInt({ gt: 0 })
            .withMessage('Comment ID must be greater than 0')
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
