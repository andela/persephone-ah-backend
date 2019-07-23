import moment from 'moment';
import { upload } from '../helpers/image.helper';
import model from '../db/models';
import Helper from './helper';
import { paginationQueryMetadata, pageMetadata } from '../helpers/pagination';
import readtime from '../helpers/read-time';

const { Comment, Article, User, Follow, Rating, CommentReaction } = model;
/** Istanbul ignore next */
/**
 * @method createArticleService
 * @description Creates a new article
 * Route: POST: /articles
 * @param {Object} data request object
 *
 * @returns {Object} article data object
 */
// eslint-disable-next-line import/prefer-default-export
export const createArticleService = async data => {
  const { title, body, description } = data.body;
  const userId = data.user.id;
  const readTime = await readtime(body);

  const uploadedImage = [];
  const images = data.files;
  const imagePaths = [];

  const loopUpload = async image => {
    // eslint-disable-next-line no-restricted-syntax
    for (const imageItem of image) {
      const imagePath = imageItem.path;
      const imageUniqueName = imageItem.originalname;
      // eslint-disable-next-line no-await-in-loop
      const imageResponse = await upload(imagePath, imageUniqueName, 'post');
      uploadedImage.push(imageResponse.secure_url);
      imagePaths.push(imagePath);
    }
  };

  if (images) {
    await loopUpload(images);
    // imagePaths.forEach(path => {
    //   fs.unlinkSync(path);
    // });
  }
  const finalUploads = JSON.stringify(Object.assign({}, uploadedImage));
  const article = await Article.create({
    userId,
    title,
    description,
    body,
    image: finalUploads,
    readTime
  });

  return article;
};

/**
 * @method getArticleService
 * @description fetches a article
 * Route: GET: /articles/:slug
 * @param {Object} data request object
 *
 * @returns {Object} article data object
 */

export const getArticleService = async data => {
  const articleSlug = data.params.slug;
  const article = await Article.findOne({
    where: { slug: articleSlug, isPublished: true },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['firstName', 'lastName', 'image']
      }
    ]
  });
  return article;
};

/**
 * @method userGetDraftArticleService
 * @description fetches all draft articles for a user
 * Route: GET: /articles/draft
 *
 * @returns {Object} article data object
 */

export const userGetDraftArticleService = async data => {
  const authorId = data.user.id;
  const article = await Article.findAll({
    where: {
      userId: authorId,
      isPublished: false,
      isDeleted: false
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['firstName', 'lastName', 'image']
      }
    ]
  });
  return article;
};

/**
 * @method userGetPublishedArticleService
 * @description fetches all published articles for a user
 * Route: GET: /articles/publish
 *
 * @returns {Object} article data object
 */

export const userGetPublishedArticleService = async data => {
  const authorId = data.user.id;
  const article = await Article.findAll({
    where: {
      userId: authorId,
      isPublished: true,
      isDeleted: false
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['firstName', 'lastName', 'image']
      }
    ]
  });
  return article;
};

/**
 * @method getSingleUserPublishedArticleService
 * @description fetches all published articles for a user
 * Route: GET: /articles/publish
 *
 * @returns {Object} article data object
 */

export const getSingleUserPublishedArticleService = async data => {
  const authorId = data.params.userId;
  const article = await Article.findAll({
    where: {
      userId: authorId,
      isPublished: true,
      isDeleted: false
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['firstName', 'lastName', 'image']
      }
    ]
  });
  return article;
};

/**
 * @method getAllPublishedArticleService
 * @description fetches published all articles
 * Route: GET: /articles
 *
 * @returns {Object} article data object
 */

export const getAllPublishedArticleService = async (
  queryParams,
  returnValue
) => {
  try {
    const { limit, offset } = paginationQueryMetadata(
      queryParams.query.page,
      queryParams.query.limit
    );
    const article = await Article.findAndCountAll({
      limit,
      offset,
      where: {
        isPublished: true,
        isDeleted: false
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['firstName', 'lastName', 'image']
        }
      ]
    });

    const pageResponse = pageMetadata(
      queryParams.query.page,
      queryParams.query.limit,
      article.count,
      '/articles'
    );
    if (article.count === 0) {
      return Helper.failResponse(returnValue, 404, {
        message: 'No article in the database'
      });
    }
    const allArticles = article.rows;
    return { pageResponse, allArticles };
  } catch (err) {
    return err.message;
  }
};

/**
 * @method updateArticleService
 * @description updates an article
 * Route: PUT: /articles/:slug
 *
 * @returns {Object} article data object
 */

export const updateArticleService = async data => {
  const { title, body, description } = data.body;
  const readTime = await readtime(body);
  const authorArticle = await Article.findOne({
    where: { userId: data.user.id, slug: data.params.slug }
  });
  if (authorArticle === null) {
    return authorArticle;
  }

  const uploadedImage = [];
  const images = data.files;

  const loopUpload = async image => {
    // eslint-disable-next-line no-restricted-syntax
    for (const imageItem of image) {
      const imagePath = imageItem.path;
      const imageUniqueName = imageItem.originalname;
      // eslint-disable-next-line no-await-in-loop
      const imageResponse = await upload(imagePath, imageUniqueName, 'post');
      uploadedImage.push(imageResponse.secure_url);
    }
  };

  if (images) {
    await loopUpload(images);
  }
  const finalUploads = JSON.stringify(Object.assign({}, uploadedImage));
  const article = await authorArticle.update({
    title,
    description,
    body,
    image: finalUploads,
    readTime
  });
  return article;
};

/**
 * @method deleteArticleService
 * @description deletes a article
 * Route: DELETE: /articles/:slug
 * @param {Object} data request object
 *
 * @returns {Object} article data object
 */

export const deleteArticleService = async data => {
  const articleSlug = data.params.slug;
  const authorArticle = await Article.findOne({
    where: { userId: data.user.id, slug: articleSlug }
  });
  if (authorArticle === null) {
    return authorArticle;
  }
  const article = await authorArticle.update({ isDeleted: true });
  return article;
};

/**
 * @method publishArticleService
 * @description update article for publishing
 * Route: PUT: /articles/publish/:slug
 * @param {Object} data request object
 *
 * @returns {Object} article data object
 */

export const publishArticleService = async data => {
  const articleSlug = data.params.slug;
  const authorArticle = await Article.findOne({
    where: { userId: data.user.id, slug: articleSlug }
  });
  if (authorArticle === null) {
    return authorArticle;
  }
  const date = new Date();
  const article = await authorArticle.update({
    isPublished: true,
    publishedAt: date.toISOString()
  });
  return article;
};

/**
 * @method unPublishArticleService
 * @description update article for publishing
 * Route: PUT: /articles/publish/:slug
 * @param {Object} data request object
 *
 * @returns {Object} article data object
 */

export const unPublishArticleService = async data => {
  const articleSlug = data.params.slug;
  const authorArticle = await Article.findOne({
    where: { userId: data.user.id, slug: articleSlug }
  });
  if (authorArticle === null) {
    return authorArticle;
  }
  const article = await authorArticle.update({
    isPublished: false,
    publishedAt: null
  });
  return article;
};

/**
 * @method createCommentService
 * - it persist a new comment to the comment table
 * - returns comment data
 *
 * @param {Object} userId userId of the user making the comment
 * @param {Object} slug slug of the comment
 * @param {Object} comments details of the comment
 *
 * @returns {Object} comment object
 */

export const createCommentService = async (userId, slug, commentDetails) => {
  const article = await Article.findOne({
    where: { slug },
    raw: true,
    attributes: ['userId'],
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['firstName', 'lastName'],
        include: [
          { model: Follow, as: 'followersfriend', attributes: ['isFollowing'] }
        ]
      }
    ]
  });

  if (!article) {
    const response = { status: 404, message: 'no article found' };
    throw response;
  }

  const articleId = article.id;

  const { body, highlightedText } = commentDetails;

  const date = moment();

  const bodyDetails = { [date]: body };

  const result = await Comment.create({
    articleId,
    userId,
    slug,
    body: bodyDetails,
    highlightedText: highlightedText || null
  });

  const comment = {
    id: result.id,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    slug: result.slug,
    body: result.body,
    highlightedText: result.highlightedText,
    author: {
      firstName: article['author.firstName'],
      lastName: article['author.lastName'],
      following: article['author.followersfriend.isFollowing']
        ? article['author.followersfriend.isFollowing']
        : false
    }
  };
  return comment;
};

/**
 * @method createCommentService
 * - it persist a new comment to the comment table
 * - returns comment data
 *
 * @param {Object} userId userId of the user making the comment
 * @param {Object} slug slug of the comment
 * @param {Object} comments details of the comment
 *
 * @returns {Object} comment object
 */

export const getAllArticleCommentsService = async slug => {
  const article = await Article.findOne({
    where: { slug },
    raw: true,
    attributes: {
      exclude: [
        'userId',
        'numberOfRating',
        'sumOfRating',
        'status',
        'updatedAt'
      ]
    }
  });

  if (!article) {
    const response = 'article not found';
    throw response;
  }
  const articleId = article.id;
  const comments = await Comment.findAll({
    where: { articleId },
    attributes: ['body', 'highlightedText', 'slug', 'createdAt'],
    include: [
      {
        model: User,
        as: 'userComment',
        attributes: ['firstName', 'lastName', 'userName']
      }
    ]
  });

  return { article, comments };
};

/**
 * @method deleteCommentService
 * - it soft delete a comment
 * - returns article data
 *
 * @param {Object} id id of the comment
 * @param {Object} slug slug of the comment
 *
 * @returns {Object} article object
 */

export const deleteCommentService = async (slug, id, userId) => {
  const comment = await Comment.findOne({
    where: { slug, id },
    attributes: {
      exclude: ['numberOfRating', 'sumOfRating', 'status', 'updatedAt']
    }
  });

  if (!comment) {
    const response = 'comment not found';
    throw response;
  }

  if (comment.dataValues.userId !== userId) {
    const response = "you can not delete another user's comment";
    throw response;
  }

  const { articleId } = comment;
  const article = await Article.findOne({
    where: { id: articleId },
    raw: true,
    attributes: ['slug']
  });

  comment.destroy();

  const response = getAllArticleCommentsService(article.slug);

  return response;
};

/**
 * @method updateArticleRating
 * - Helps update the article table
 *
 * @param {integer} articleId - Id of the article to be rated
 * @param {integer} rating the rating value from from 1 - 5
 * @param {integer} userId - id of the user rating the article
 *
 * @return {Promise}
 */

const updateArticlesRating = async (
  sumOfRating,
  numberOfRating,
  averageRating,
  id
) => {
  const article = await Article.findByPk(id);
  return article.update({
    sumOfRating,
    numberOfRating,
    averageRating
  });
};

/**
 * @method articleRatingsService
 * @description Helps handle the ratings endpoint
 * Route: POST: /articles/ratings
 *
 * @param {integer} articleId - Id of the article to be rated
 * @param {integer} rating the rating value from from 1 - 5
 * @param {integer} userId - id of the user rating the article
 *
 * @return {Promise}
 */

export const articleRatingsService = async (articleId, rating, userId) => {
  rating = parseInt(rating, 10);
  try {
    const article = await Article.findByPk(articleId);

    if (!article) {
      return 'The article specified does not exist';
    }

    let { sumOfRating, numberOfRating, averageRating } = article.dataValues;

    sumOfRating = sumOfRating ? sumOfRating + rating : rating;
    numberOfRating = numberOfRating ? numberOfRating + 1 : 1;
    averageRating = averageRating
      ? parseFloat((sumOfRating / numberOfRating).toFixed(1))
      : sumOfRating;

    const ratings = await Rating.findOne({ where: { userId, articleId } });
    if (ratings) {
      return null;
    }

    const result = await Rating.create({
      userId,
      articleId,
      rating
    });

    await updateArticlesRating(
      sumOfRating,
      numberOfRating,
      averageRating,
      articleId
    );
    return result;
  } catch (error) {
    return error;
  }
};

export const getCommentLikesCount = async commentId => {
  const likeCount = await CommentReaction.findAndCountAll({
    where: { commentId }
  });

  return likeCount.count;
};
/**
 * @method likeCommentService
 *  - helps populate the reaction table with comment liked
 *
 * @param {string} slug - the comment that is liked
 * @param {integer} commentId - the comment that is liked
 * @param {integer} userId - the person that reacted to this comment
 * @param {string} reaction - the reaction value -like or dislike
 */

export const likeCommentService = async (slug, commentId, userId) => {
  try {
    const articleExist = await Article.findOne({ where: { slug } });

    const commentExist = await Comment.findByPk(commentId);

    if (!articleExist) {
      return `The article with the specified slug does not exist`;
    }

    if (!commentExist) {
      return 'The comment with the specified id does not exist';
    }

    const findReaction = await CommentReaction.findOne({
      where: {
        userId,
        commentId
      }
    });

    if (!findReaction) {
      await CommentReaction.create({
        userId,
        commentId
      });

      const likeCount = await getCommentLikesCount(commentId);

      const result = {
        likeCount,
        message: 'you have successfully liked this comment',
        commentId,
        userId
      };
      return result;
    }
    await CommentReaction.destroy({
      where: {
        userId,
        commentId
      }
    });

    const likeCount = await getCommentLikesCount(commentId);

    const result = {
      likeCount,
      message: 'you have successfully unliked this comment',
      commentId,
      userId
    };
    return result;
  } catch (error) {
    return error.message;
  }
};

/**
 * @method fetchRatingsService
 * - helps fetch all ratings on an article
 *
 * @param {integer} articleId
 */

export const fetchRatingsService = async (articleId, queryParams) => {
  const articleExist = await Article.findByPk(articleId);

  if (!articleExist) return `Article with id: ${articleId} does not exist`;
  const { limit, offset } = paginationQueryMetadata(
    queryParams.query.page,
    queryParams.query.limit
  );

  const ratings = await Rating.findAndCountAll({
    limit,
    offset,
    where: { articleId },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [
      {
        model: User,
        as: 'rater',
        attributes: ['firstName', 'lastName', 'image', 'userName']
      }
    ]
  });
  const pageResponse = pageMetadata(
    queryParams.query.page,
    queryParams.query.limit,
    ratings.count,
    `/articles/${articleId}/ratings`
  );
  const allRatings = ratings.rows;
  return { pageResponse, allRatings };
};
