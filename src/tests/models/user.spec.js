import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from 'sequelize-test-helpers';

import UserModel from '../../db/models/user';

describe('src/models/User', () => {
  const User = UserModel(sequelize, dataTypes);
  const user = new User();

  checkModelName(User)('User');

  context('properties', () => {
    [
      'firstName',
      'lastName',
      'email',
      'confirmEmailCode',
      'password',
      'confirmEmail',
      'isNotified',
      'passwordToken',
      'socialAuth',
      'roleType',
      'image',
      'bio',
      'twitterHandle',
      'facebookHandle',
      'userName'
    ].forEach(checkPropertyExists(user));
  });
});
