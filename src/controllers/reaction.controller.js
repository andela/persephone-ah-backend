import { reactionService } from '../services/reaction.service';
import Helper from '../services/helper';

export default {
  /**
   *@method articleLike
   *
   * @param {*} request
   * @param {*} response
   */

  async articlesLike(request, response) {
    try {
      const value = await reactionService(request);
      return Helper.successResponse(response, 200, value);
    } catch (error) {
      return error;
    }
  }
};
