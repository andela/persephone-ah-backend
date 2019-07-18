import faker from 'faker';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import models from '../../db/models';

const { User, Article } = models;

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

export const getUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
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
