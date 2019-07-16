import fs from 'fs';
import models from '../db/models';
import { upload } from '../helpers/image.helper';

const { Article, User } = models;
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
    imagePaths.forEach(path => {
      fs.unlinkSync(path);
    });
  }
  const finalUploads = JSON.stringify(Object.assign({}, uploadedImage));
  const article = await Article.create({
    userId,
    title,
    description,
    body,
    image: finalUploads
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
    where: { slug: articleSlug },
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

export const getAllPublishedArticleService = async () => {
  const article = await Article.findAll({
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
  return article;
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
    image: finalUploads
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
