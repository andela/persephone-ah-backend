import model from '../db/models';

const { User } = model;

/**
 * @description Get all users details without password and confirmEmailCode
 *Route: GET: /users/

 * @returns {Object} users object
 */

// eslint-disable-next-line import/prefer-default-export
export const getAllUsersServic = () => {
  const users = User.findAll({
    attributes: {
      exclude: ['password', 'confirmEmailCode']
    }
  });
  return users;
};
