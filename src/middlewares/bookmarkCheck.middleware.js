import { getArticleInstance } from '../services/bookmark.service';
import Utilities from '../helpers/utilities.helper';
import Helper from '../services/helper';

export default {
  /**
   * @method bookmarkCheck
   * Validates incoming bookmark requests
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object|function} error object response or next middleware function
   */

  async bookmarkCheck(request, response, next) {
    const validSlug = await Utilities.isValidSlug(request.params.slug);
    if (!validSlug) {
      return Helper.failResponse(response, 400, {
        message: 'Article slug is not valid'
      });
    }
    const article = await getArticleInstance(request.params.slug);
    if (!article) {
      return Helper.failResponse(response, 404, {
        message: `Article does not exist`
      });
    }
    request.articleId = article.id;
    next();
  }
};
