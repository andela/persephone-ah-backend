import faker from 'faker';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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

export const createUser = user => {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const confirmEmailCode = crypto.randomBytes(16).toString('hex');
  User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: hashedPassword,
    confirmEmailCode
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
