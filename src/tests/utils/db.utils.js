/* eslint-disable class-methods-use-this */
import faker from 'faker';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import models from '../../db/models';

const { User, Article, Comment } = models;

export const getUserData = {
  firstName: 'james',
  lastName: 'Monday',
  email: 'author@email.com',
  password: 'Doejohn40'
};

export const getArticleData = () => ({
  title: 'new article',
  description: 'this is a description',
  body: 'this is a description this is a description'
});

export const publishArticleData = async () => {
  const article = await Article.create(getArticleData());
  await article.update({ isPublished: true });
  return article;
};
export const getUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: 'Author40'
});

export const getUserName = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  userName: faker.internet.userName(),
  password: 'Author40'
});

export const superAdminData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: 'Author40',
  role: 'super_admin'
};

export const adminData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: 'Author40',
  role: 'admin'
};

export const createUser = user => {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const confirmEmailCode = crypto.randomBytes(16).toString('hex');
  return User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: hashedPassword,
    confirmEmailCode
  });
};

export const createUserName = user => {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const confirmEmailCode = crypto.randomBytes(16).toString('hex');
  return User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userName: user.userName,
    password: hashedPassword,
    confirmEmailCode
  });
};

export const createSuperAdmin = () => {
  const hashedPassword = bcrypt.hashSync('author40', 10);
  const confirmEmailCode = crypto.randomBytes(16).toString('hex');
  return User.create({
    firstName: 'Damilola',
    lastName: 'Adekoya',
    email: 'koya@gmail.com',
    password: hashedPassword,
    confirmEmailCode,
    roleType: 'super_admin'
  });
};

/**
 * @method mockCreateArticle
 * @description this helper function helps seed in article
 * - into the database for test purpose
 *
 * @param {integer} userId the id of the creator of this article
 * @return {promise}
 */

export const mockCreateArticle = userId => {
  const seed = {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(4),
    slug: faker.lorem.words(2)
  };

  return Article.create({
    userId,
    title: seed.title,
    body: seed.body,
    slug: seed.slug
  });
};

/**
 * @method createComment
 * @description this helper function helps seed in comment
 * - into the database for test purpose
 *
 * @param {integer} userId the id of the creator of this comment
 * @param {integer} articleId the id of the article this comment is for
 * @param {string} articleSlug the slug of the article this comment is for
 */

export const createComment = (userId, articleId, articleSlug) => {
  const seed = {
    body: faker.lorem.paragraphs(4)
  };

  return Comment.create({
    userId,
    articleId,
    body: seed.body,
    slug: articleSlug
  });
};

/**
 *
 * @export
 * @class Response
 * @method status
 * @method json
 */
export class Response {
  /**
   *
   *
   * @memberof Response
   * @returns {object} this
   */
  status() {
    return this;
  }

  /**
   *
   *
   * @memberof Response
   * @returns {object} this
   */
  json() {
    return this;
  }
}
