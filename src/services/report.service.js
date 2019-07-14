import model from '../db/models';
import { sendBlockedArticle } from '../helpers/mail.helper';

const { Article, User, Follow, Report } = model;

/**
 * @method createReportService
 * - it persist a new report to the report table
 * - returns report data and author details
 *
 * @param {Object} userId userId of the user making the comment
 * @param {Object} slug slug of the article
 * @param {Object} reportBody body of the report
 *
 * @returns {Object} comment object
 */

export const createReportService = async (userId, slug, reason) => {
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
    const response = 'article not found';
    throw response;
  }

  const articleId = article.id;

  const result = await Report.create({
    articleId,
    userId,
    reason
  });
  const comment = {
    id: result.id,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    reason: result.reason,
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
 * @method removeArticleService
 * - it persist a new comment to the comment table
 * - returns comment data
 *
 * @param {Object} slug slug of the article
 *
 * @returns {Object} comment object
 */

export const removeArticleService = async slug => {
  const article = await Article.findOne({
    where: { slug },
    attributes: {
      exclude: ['numberOfRating', 'sumOfRating', 'status', 'updatedAt']
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['firstName', 'lastName', 'email'],
        include: [
          { model: Follow, as: 'followersfriend', attributes: ['isFollowing'] }
        ]
      }
    ]
  });

  if (!article) {
    const response = 'article not found';
    throw response;
  }

  await article.destroy();
  const { firstName, lastName, email } = article.dataValues.author.dataValues;
  const name = `${firstName} ${lastName}`;

  sendBlockedArticle(
    name,
    email.toLocaleLowerCase(),
    'Article Blocked',
    'blocked-article',
    article.title
  );

  return article;
};
