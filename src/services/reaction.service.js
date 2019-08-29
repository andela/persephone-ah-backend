/* eslint-disable import/prefer-default-export */
import models from '../db/models';
import { likeArticleNotification } from './notification.service';

const { ArticleReaction, Article } = models;
/**
 * @method reactionService
 * - user can like or dislike article
 * - returns true or false
 *
 * @param {Object} data request object
 *
 * @returns {Object} user object
 * */

export const reactionService = async data => {
  const { articleId } = data.params;
  const userId = data.user.id;
  // checks if article has any reaction
  try {
    const findReaction = await ArticleReaction.findOne({
      where: {
        userId,
        articleId
      }
    });
    const article = await Article.findOne({
      where: {
        id: articleId
      }
    });

    if (findReaction == null) {
      await ArticleReaction.create({
        userId,
        articleId
      });

      const details = {
        userId: article.dataValues.userId,
        likeUserId: userId,
        articleSlug: article.dataValues.slug
      };
      likeArticleNotification(details);
      return { message: 'You have liked this article successfully' };
    }
    await findReaction.destroy({ where: { userId } });
    return { message: 'You have disliked this article successfully' };
  } catch (error) {
    throw Error(error);
  }
};
