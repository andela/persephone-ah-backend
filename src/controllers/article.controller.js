import {
  createCommentService,
  getAllArticleCommentsService,
  deleteCommentService,
  createArticleService,
  getArticleService,
  userGetDraftArticleService,
  getAllPublishedArticleService,
  userGetPublishedArticleService,
  getSingleUserPublishedArticleService,
  publishArticleService,
  unPublishArticleService,
  updateArticleService,
  deleteArticleService,
  articleRatingsService,
  fetchRatingsService,
  likeCommentService,
  fetchTagsService
} from '../services/article.service';

import Helper from '../services/helper';
import models from '../db/models';

const { Article } = models;

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
      return Helper.failResponse(response, 500, error.message);
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
   * @description fetch all published articles by a specific user
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
      const article = await getAllPublishedArticleService(request, response);
      return Helper.successResponse(response, 200, article);
    } catch (error) {
      /* instanbul ignore next */
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
  },
  /**
   * @method createComment
   * - user make comment on an article
   * - validate user input
   * - returns comment and user who made the article
   * Route: POST: /users/signup
   *
   * @param {Object} request request object
   * @param {Object} response response object
   *
   * @returns {Response} response object
   */

  async createComment(request, response) {
    try {
      const userId = request.user.id;
      const { slug } = request.params;

      const value = await createCommentService(userId, slug, request.body);
      return Helper.successResponse(response, 201, value);
    } catch (error) {
      if (error.status === 404) {
        return Helper.errorResponse(response, error.status, error.message);
      }
      return Helper.errorResponse(response, 500, error);
    }
  },

  /**
   * @method allArticleComments
   * - get all the comments of an article
   * - returns an article and all the comments attached to the article
   * Route: GET: /articles/signup
   *
   * @param {Object} request request object
   * @param {Object} response response object
   *
   * @returns {Response} response object
   */

  async allArticleComments(request, response) {
    try {
      const { slug } = request.params;

      const value = await getAllArticleCommentsService(slug);
      return Helper.successResponse(response, 201, value);
    } catch (error) {
      return Helper.failResponse(response, 400, error);
    }
  },

  /**
   * @method deleteComment
   * - delete a comment
   * - returns the article
   * Route: DELETE: /articles/:slug/comments/:id
   *
   * @param {Object} request request object
   * @param {Object} response response object
   *
   * @returns {Response} response object
   */

  async deleteComment(request, response) {
    try {
      const { slug } = request.params;
      const { commentId } = request.params;
      const userId = request.user.id;

      const value = await deleteCommentService(slug, commentId, userId);
      return Helper.successResponse(response, 200, value);
    } catch (error) {
      return Helper.failResponse(response, 400, error);
    }
  },

  /**
   * @method ratings
   * @description handles the logic of create article
   * Route: POST: /articles/ratings
   * @param {Object} request request object
   * @param {Object} response request object
   * @returns {Response} response object
   */

  async ratings(request, response) {
    const { articleId, rating } = request.body;
    const userId = request.user.id;

    const result = await articleRatingsService(articleId, rating, userId);

    if (result === 'The article specified does not exist') {
      return Helper.failResponse(response, 404, {
        message: 'The article specified does not exist'
      });
    }

    if (!result) {
      return Helper.failResponse(
        response,
        400,
        'you are only allowed to rate this article once'
      );
    }
    return Helper.successResponse(response, 201, result);
  },

  async fetchRatings(request, response) {
    let { articleId } = request.params;
    articleId = parseInt(articleId, 10);

    const result = await fetchRatingsService(articleId, request, response);

    if (result === `Article with id: ${articleId} does not exist`) {
      return Helper.failResponse(response, 404, result);
    }
    return Helper.successResponse(response, 200, result);
  },

  /**
   * @method likeComment
   * @description handles the logic to like a comment
   * Route: POST: /articles/ratings
   * @param {object} request containing the user request metadata
   * @param {object} response contains the response to the question
   *
   * @returns {object} contains the appropriate response
   */

  async likeComment(request, response) {
    const { id, email } = request.user;
    const { slug, commentId } = request.params;

    const result = await likeCommentService(slug, commentId, id, email);

    if (result === `The article with the specified slug does not exist`) {
      return Helper.failResponse(response, 404, {
        message: result
      });
    }

    if (result === `The comment with the specified id does not exist`) {
      return Helper.failResponse(response, 404, {
        message: result
      });
    }
    if (result) return Helper.successResponse(response, 200, result);

    if (result.length < 1) {
      return Helper.successResponse(
        response,
        200,
        'specified article does not have any ratings'
      );
    }

    return Helper.successResponse(response, 200, result);
  },

  /**
   * @method fetchTags
   * - Route: GET: /articles/tags
   * - Helps handle the request to the above route
   *
   * @param {request} request
   * @param {response} response
   */

  async fetchTags(request, response) {
    const result = await fetchTagsService();

    if (result.length > 0) {
      return Helper.successResponse(response, 200, result);
    }
  }
};
