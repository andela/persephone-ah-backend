import {
  createReportService,
  removeArticleService
} from '../services/report.service';
import Helper from '../services/helper';

/**
 * @method createReport
 * - user report an article
 * - validate user input
 * - returns report and article
 * Route: POST: /articles/:slug/reports
 *
 * @param {Object} request request object
 * @param {Object} response response object
 *
 * @returns {Response} response object
 */

const createReport = async (request, response) => {
  try {
    const userId = request.user.id;
    const { slug } = request.params;
    const { reason } = request.body;

    const value = await createReportService(userId, slug, reason);
    return Helper.successResponse(response, 201, value);
  } catch (error) {
    return Helper.failResponse(response, 500, error);
  }
};

/**
 * @method createReport
 * - user report an article
 * - validate user input
 * - returns report and article
 * Route: POST: /articles/:slug/reports
 *
 * @param {Object} request request object
 * @param {Object} response response object
 *
 * @returns {Response} response object
 */

const removeArticle = async (request, response) => {
  try {
    const { slug } = request.params;

    const value = await removeArticleService(slug);
    return Helper.successResponse(response, 200, value);
  } catch (error) {
    return Helper.failResponse(response, 400, error);
  }
};

export default {
  createReport,
  removeArticle
};
