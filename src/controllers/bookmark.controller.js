import {
  createBookmark,
  removeBookmark,
  getBookmarks
} from '../services/bookmark.service';
import Helper from '../services/helper';

export default {
  /**
   * @method createBookmark
   * Handles the logic for adding an article to a user's bookmark
   * Route: POST api/v1/articles/:slug/bookmarks
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API Response object or next method
   */

  async createBookmark(request, response, next) {
    try {
      const bookmarked = await createBookmark(
        request.articleId,
        request.user.id
      );
      if (bookmarked) {
        return Helper.successResponse(response, 201, {
          message: `Article added to bookmarks`
        });
      }
      return Helper.failResponse(response, 409, {
        message: `Article is already in your bookmarks`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @method getUserBookmarks
   * Route: GET api/v1/articles/bookmarks
   * Handles the logic for fetching all a user's bookmark
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API Response object or next method
   */

  async getUserBookmarks(request, response, next) {
    try {
      const bookmarks = await getBookmarks(request.user.id);
      return Helper.successResponse(response, 200, bookmarks);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @method removeUserBookmark
   * Route: DELETE api/v1/articles/:slug/bookmarks
   * Handles the logic for removing an article from a user's bookmark
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API Response object or next method
   */

  async removeUserBookmark(request, response, next) {
    try {
      const removed = await removeBookmark(request.articleId, request.user.id);
      if (removed) {
        return Helper.successResponse(response, 200, {
          message: `Article has been removed from your bookmarks`
        });
      }
      return Helper.failResponse(response, 404, {
        message: `Article is not present in your bookmarks`
      });
    } catch (error) {
      next(error);
    }
  }
};
