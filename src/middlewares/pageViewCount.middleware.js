import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../db/models';
import Helper from '../services/helper';

dotenv.config();
const { Article } = models;
/**
 * @method pageViewCount
 * - user can like or dislike article
 * - returns true or false
 *
 * @param {Object} data request object
 *
 * @returns {Object} user object
 * */

// eslint-disable-next-line import/prefer-default-export
export const pageViewCount = async (request, response, next) => {
  const { slug } = request.params;
  // checks if article exists
  const findArticle = await Article.findOne({
    where: {
      slug,
      isPublished: true
    }
  });
  let decode;
  let isAuthor;
  try {
    if (request.headers.authorization) {
      const token = request.headers.authorization.split(' ')[1];
      decode = await jwt.verify(token, process.env.SECRET);
      isAuthor = request.authorId === decode.id;
    }
  } catch (error) {
    return Helper.failResponse(response, 500, error);
  }
  if (!isAuthor && findArticle) {
    // increment views count
    await findArticle.increment('viewsCount', {
      by: 1
    });
  }
  next();
};
