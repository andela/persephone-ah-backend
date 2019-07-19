import {
  getCommentEditHistory,
  editComment,
  getSingleArticleComment
} from '../services/comment.service';
import Helper from '../services/helper';

export default {
  /**
   * @method getCommentHistory
   * Handles the logic for fetching a comment's edit history
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API response object
   */

  async getCommentHistory(request, response, next) {
    try {
      const { id, slug } = request.params;
      const commentHistory = await getCommentEditHistory(id, slug);
      if (!commentHistory) {
        return Helper.failResponse(response, 404, {
          message: 'Comment does not exist'
        });
      }
      return Helper.successResponse(response, 200, commentHistory);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @method editComment
   * Handles the logic for editing a comment
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API response object
   */

  async editComment(request, response, next) {
    try {
      const { comment } = request.body;
      const { id, slug } = request.params;
      const updatedComment = await editComment(id, slug, comment);
      return Helper.successResponse(response, 200, updatedComment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @method getSingleComment
   * Handles the logic for fetching a single comment record
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API response object
   */

  async getSingleComment(request, response, next) {
    try {
      const { id, slug } = request.params;
      const comment = await getSingleArticleComment(id, slug);
      if (!comment) {
        return Helper.failResponse(response, 404, {
          message: 'Comment does not exist'
        });
      }
      return Helper.successResponse(response, 200, comment);
    } catch (error) {
      next(error);
    }
  }
};
