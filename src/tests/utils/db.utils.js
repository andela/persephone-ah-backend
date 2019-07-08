import faker from 'faker';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import models from '../../db/models';

const { User } = models;

export const getUserData = {
  firstName: 'james',
  lastName: 'Monday',
  email: 'author@email.com',
  password: 'Doejohn40'
};

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
