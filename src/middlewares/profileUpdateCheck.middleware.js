import { findByUserName, findUserById } from '../services/auth.service';
import Helper from '../services/helper';
/**
 *
 * @description Handles neccessary checks on profile update
 * @param {object} request
 * @param {object} response
 * @param {function} next
 * @returns {(function|Object)} Function next() or an error Object
 */
const profileChecks = async (request, response, next) => {
  try {
    const userInstance = await findUserById(request.user.id);
    if (!userInstance) {
      return Helper.failResponse(response, 404, {
        message: 'User account does not exist'
      });
    }

    if (request.body.userName) {
      const userNameExists = await findByUserName(request.body.userName);
      const { id } = userNameExists;
      if (userNameExists && id !== request.user.id) {
        return Helper.failResponse(response, 409, {
          message: 'Username has already been taken'
        });
      }
    }
    request.foundUser = userInstance;

    return next();
  } catch (error) {
    return Helper.errorResponse(response, 500, error);
  }
};

export default { profileChecks };
