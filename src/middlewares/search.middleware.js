import Helper from '../services/helper';

export default {
  /**
   * @method searchFilterCheck
   * Validates incoming request parameters on searching and filtering.
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} API response object
   */

  async searchFilterCheck(request, response, next) {
    const filterParams = Object.keys(request.query);
    if (filterParams.length < 1) {
      return Helper.failResponse(response, 400, {
        message: `Filter parameters cannot be empty`
      });
    }
    const errors = [];
    const { tag, author, title } = request.query;

    if (filterParams.includes('tag')) {
      if (!tag) {
        errors.push('Tag cannot be empty');
      }
      request.query.tag = tag.toLowerCase().trim();
    }

    if (filterParams.includes('author')) {
      if (!author) {
        errors.push('Author cannot be empty');
      }
      request.query.author = author.toLowerCase().trim();
    }

    if (filterParams.includes('title')) {
      if (!title) {
        errors.push('Title cannot be empty');
      }
      request.query.title = title.toLowerCase().trim();
    }

    if (errors.length > 0) {
      return Helper.failResponse(response, 400, { message: errors[0] });
    }
    next();
  }
};
