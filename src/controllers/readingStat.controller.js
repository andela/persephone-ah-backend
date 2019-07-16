import { readingStatService } from '../services/stats.service';
import Helper from '../services/helper';

export default {
  /**
   *@method readingStats
   *
   * @param {*} request
   * @param {*} response
   */

  async readingStats(request, response) {
    try {
      const value = await readingStatService(request);
      return Helper.successResponse(response, 200, value);
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  }
};
