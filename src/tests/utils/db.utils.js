import faker from 'faker';
import models from '../../db/models';
import getToken from '../../helpers/jwt.helper';

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

export const createUser = user =>
  User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: 'Author40'
  });

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
