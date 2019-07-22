/* eslint-disable import/prefer-default-export */
import models from '../db/models';

const { Article, Reaction } = models;
/**
 * @method articleService
 * - user can like or dislike article
 *
 * @param {Object} data request object
 *
 * @returns {Object} message object
 * */

export const reactionService = async data => {
  const { reaction } = data.body;
  const { postId } = data.params;
  const userId = data.user.id;
  // checks if article has any reaction
  const counter = 1;
  const isLiked = reaction === 'like';

  try {
    const findReaction = await Reaction.findOne({
      where: {
        userId,
        articleId: postId
      }
    });
    const findArticle = await Article.findByPk(postId);
    if (findReaction == null) {
      await Reaction.create({
        userId,
        articleId: postId
      });
      await findArticle.increment('likesCount', {
        by: counter,
        where: { id: postId }
      });
      return { message: 'You have liked this article successfully' };
    }
    if (findReaction.isLiked === true && reaction === 'dislike') {
      await findArticle.decrement('likesCount', {
        by: counter,
        where: { id: postId }
      });
      await findReaction.update({ isLiked });
      return { message: 'You have disliked this article successfully' };
    }
    if (findReaction.isLiked === false && reaction === 'like') {
      await findArticle.increment('likesCount', {
        by: counter,
        where: { id: postId }
      });
      await findReaction.update({ isLiked });
      return { message: 'You have liked this article successfully' };
    }
    if (findReaction.isLiked === true && reaction === 'like') {
      return { message: 'You can not like an article more than once' };
    }
    if (findReaction.isLiked === false && reaction === 'dislike') {
      return { message: 'You can not dislike an article more than once' };
    }
  } catch (error) {
    throw Error(error);
  }
};
