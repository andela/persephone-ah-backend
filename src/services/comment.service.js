import moment from 'moment';
import model from '../db/models';

const { Comment, Article, User } = model;

/**
 *
 * @method findCommentRecord
 * Queries the database for a comment
 * @param {number} id
 * @param {string} slug
 * @returns {object} comment instance object
 */

export const findCommentRecord = async (id, slug) => {
  const record = await Comment.findOne({
    where: { id, slug }
  });
  return record;
};

/**
 * @method getArticleInstance
 * Queries the database for an article
 * @param {slug} slug
 * @returns {object} article instance object
 */

export const getArticleInstance = async slug => {
  const article = await Article.findOne({
    where: { slug }
  });
  return article;
};

/**
 * @method getSingleArticleComment
 * Queries the database to fetch a single article comment
 * @param {number} id
 * @param {string} slug
 * @returns {object|boolean} article response object or false if no comment is found
 */

export const getSingleArticleComment = async (id, slug) => {
  const commentRecord = await Comment.findOne({
    where: { id, slug },
    include: [
      {
        model: User,
        as: 'userComment',
        attributes: ['userName', 'bio', 'image']
      }
    ]
  });

  if (!commentRecord) return false;

  const { body } = commentRecord.get({ plain: true });
  const latestTimestamp = Object.keys(body)[Object.keys(body).length - 1];
  const latestComment = body[latestTimestamp];
  const response = {
    id,
    createdAt: latestTimestamp,
    updatedAt: commentRecord.updatedAt,
    body: latestComment,
    author: {
      username: commentRecord.userComment.userName,
      bio: commentRecord.userComment.bio,
      image: commentRecord.userComment.image
    }
  };
  return response;
};

/**
 * @method getCommentEditHistory
 * Queries the database to fetch the edit history of a comment
 * @param {number} id
 * @param {string} slug
 * @returns {object} comment history response object
 */

export const getCommentEditHistory = async (id, slug) => {
  const commentRecord = await findCommentRecord(id, slug);
  if (!commentRecord) return false;
  return { commentEditHistory: commentRecord.body };
};

/**
 * @method editComment
 * Handles the logic for updating a comment
 * @param {number} id
 * @param {string} slug
 * @param {string} newComment
 * @returns {object|boolean} comment response object
 */

export const editComment = async (id, slug, newComment) => {
  const commentRecord = await findCommentRecord(id, slug);
  const { body } = commentRecord.get({ plain: true });

  const timestamp = moment();
  body[timestamp] = newComment;

  commentRecord.update({ body, isEdited: true });
  const latestEdit = body[Object.keys(body)[Object.keys(body).length - 1]];

  return { comment: latestEdit, message: 'Comment updated successfully' };
};
