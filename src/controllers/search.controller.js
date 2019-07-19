/* eslint-disable no-nested-ternary */
import searchBy from '../services/search.service';
import Helper from '../services/helper';

export default {
  /**
   * @method searchFilter
   * Handles the logic for filtering and searching based on user input
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API response object
   */

  async searchFilter(request, response, next) {
    try {
      const { tag, author, title } = request.query;
      let searchResult;
      switch (Object.keys(request.query).length > 1) {
        case true:
          searchResult = await searchBy('multiple', request.query);
          break;
        default:
          searchResult = author
            ? await searchBy('author', author)
            : tag
            ? await searchBy('tag', tag)
            : title
            ? await searchBy('title', title)
            : undefined;
      }
      if (!searchResult) {
        return Helper.failResponse(response, 400, {
          message: `Invalid filter provided. You can only filter by 'tag', 'title' or 'author'`
        });
      }
      return Helper.successResponse(response, 200, searchResult);
    } catch (error) {
      next(error);
    }
  }
};
