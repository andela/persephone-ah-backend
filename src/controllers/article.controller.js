import {
  createArticleService,
  getArticleService,
  userGetDraftArticleService,
  getAllPublishedArticleService,
  userGetPublishedArticleService,
  getSingleUserPublishedArticleService,
  publishArticleService,
  unPublishArticleService,
  updateArticleService,
  deleteArticleService
} from '../services/article.service';
import Helper from '../services/helper';
import models from '../db/models';

const { Article } = models;
/* istanbul ignore next */
export default {
  /**
   * @method createArticle
   * @description Creates a new article
   * Route: POST: /articles
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async createArticle(request, response) {
    try {
      const article = await createArticleService(request);
      return Helper.successResponse(response, 201, article);
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method getArticle
   * @description fetch a single article
   * Route: GET: /articles/:slug
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async getArticle(request, response) {
    try {
      const article = await getArticleService(request);
      if (!article) {
        return Helper.failResponse(response, 404, {
          message: 'Article does not exist'
        });
      }
      return Helper.successResponse(response, 200, article);
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method userGetAllDraftArticles
   * @description fetch all draft articles
   * Route: GET: /articles/draft
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async userGetAllDraftArticles(request, response) {
    try {
      const article = await userGetDraftArticleService(request);
      return Helper.successResponse(response, 200, article);
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method userGetAllPublishedArticles
   * @description fetch all published articles
   * Route: GET: /articles/publish
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async userGetAllPublishedArticles(request, response) {
    try {
      const article = await userGetPublishedArticleService(request);
      return Helper.successResponse(response, 200, article);
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method getUserPublishedArticles
   * @description fetch all published articles
   * Route: GET: /articles/publish
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async getUserPublishedArticles(request, response) {
    try {
      const article = await getSingleUserPublishedArticleService(request);
      return Helper.successResponse(response, 200, article);
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method getAllPublishedArticles
   * @description fetch all articles published
   * Route: GET: /articles
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */
  async getAllPublishedArticles(request, response) {
    try {
      const article = await getAllPublishedArticleService();
      return Helper.successResponse(response, 200, article);
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method updateArticles
   * @description update a single article
   * Route: PUT: /articles/:slug
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async updateArticle(request, response) {
    try {
      const authorArticle = await Article.findOne({
        where: { slug: request.params.slug }
      });
      if (!authorArticle) {
        return Helper.failResponse(response, 404, {
          message: 'Article does not exist'
        });
      }
      const article = await updateArticleService(request);
      if (!article) {
        return Helper.failResponse(response, 403, {
          message: 'Forbidden, you can not edit this resource'
        });
      }
      return Helper.successResponse(response, 200, article);
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method deleteArticle
   * @description delete a single article
   * Route: DELETE: /articles/:slug
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async deleteArticle(request, response) {
    try {
      const authorArticle = await Article.findOne({
        where: { slug: request.params.slug }
      });
      if (!authorArticle) {
        return Helper.failResponse(response, 404, {
          message: 'Article does not exist'
        });
      }
      const article = await deleteArticleService(request);
      if (!article) {
        return Helper.failResponse(response, 403, {
          message: 'Forbidden, you can not delete this resource'
        });
      }
      return Helper.successResponse(response, 200, {
        message: 'Article deleted successfully'
      });
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method publishArticle
   * @description publish a single article
   * Route: PUT: /articles/publish/:slug
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async publishArticle(request, response) {
    try {
      const authorArticle = await Article.findOne({
        where: { slug: request.params.slug }
      });
      if (!authorArticle) {
        return Helper.failResponse(response, 404, {
          message: 'Article does not exist'
        });
      }
      const article = await publishArticleService(request);
      if (!article) {
        return Helper.failResponse(response, 403, {
          message: 'Forbidden, you can not publish this resource'
        });
      }
      return Helper.successResponse(response, 200, {
        message: 'Article published successfully'
      });
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  },

  /**
   * @method unPublishArticle
   * @description unpublish a single article
   * Route: PUT: /articles/publish/:slug
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async unPublishArticle(request, response) {
    try {
      const authorArticle = await Article.findOne({
        where: { slug: request.params.slug }
      });
      if (!authorArticle) {
        return Helper.failResponse(response, 404, {
          message: 'Article does not exist'
        });
      }
      const article = await unPublishArticleService(request);
      if (!article) {
        return Helper.failResponse(response, 403, {
          message: 'Forbidden, you can not publish this resource'
        });
      }
      return Helper.successResponse(response, 200, {
        message: 'Article unpublished successfully'
      });
    } catch (error) {
      return Helper.failResponse(response, 500, error);
    }
  }
};
