/* eslint-disable import/prefer-default-export */
import models from '../db/models';

const { Article } = models;
/**
 * @method readingStatService
 * - returns an object of author's article reading stat
 *
 * @param {Object} data request object
 *
 * @returns {Object} message object
 * */

export const readingStatService = async data => {
  const userId = data.user.id;
  try {
    const stats = await Article.findAll({
      where: { userId },
      attributes: [
        'id',
        'publishedAt',
        'title',
        'description',
        'likesCount',
        'viewsCount'
      ]
    });

    return stats;
  } catch (error) {
    throw Error(error);
  }
};
