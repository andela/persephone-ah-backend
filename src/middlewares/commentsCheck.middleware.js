import { findCommentRecord } from '../services/comment.service';
import Utilities from '../helpers/utilities.helper';
import Helper from '../services/helper';

export default {
  /**
   * @method editCommentCheck
   * Validates incoming request parameters for editing a comment.
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API response object
   */

  async editCommentCheck(request, response, next) {
    const { slug, id } = request.params;
    if (!request.body.comment) {
      return Helper.failResponse(response, 400, {
        message: 'Comment cannot be empty'
      });
    }

    const isValid = await Utilities.isNumeric(id);
    if (!isValid) {
      return Helper.failResponse(response, 400, {
        message: 'Comment ID must be a number and be greater than zero'
      });
    }
    const validSlug = await Utilities.isValidSlug(slug);
    if (!validSlug) {
      return Helper.failResponse(response, 400, {
        message: 'Article slug is not valid'
      });
    }

    const commentRecord = await findCommentRecord(id, slug);
    if (!commentRecord) {
      return Helper.failResponse(response, 404, {
        message: 'Comment does not exist'
      });
    }

    if (commentRecord.userId !== request.user.id) {
      return Helper.failResponse(response, 403, {
        message: `You don't have permission to edit this comment`
      });
    }

    return next();
  },

  /**
   * @method getArticlesCommentsCheck
   * Validates slug on incoming article requests
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API response object
   */

  async getArticlesCommentsCheck(request, response, next) {
    const validSlug = await Utilities.isValidSlug(request.params.slug);
    if (!validSlug) {
      return Helper.failResponse(response, 400, {
        message: 'Article slug is not valid'
      });
    }
    if (request.params.id) {
      const isValid = await Utilities.isNumeric(request.params.id);
      if (!isValid) {
        return Helper.failResponse(response, 400, {
          message: 'Comment ID must be a number and be greater than zero'
        });
      }
    }
    return next();
  }
};
