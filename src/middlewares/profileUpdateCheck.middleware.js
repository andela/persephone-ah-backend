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
    const errors = [];
    if ('firstName' in request.body) {
      if (!request.body.firstName) errors.push('firstName cannot be empty');
    }
    if ('lastName' in request.body) {
      if (!request.body.lastName) errors.push('lastName cannot be empty');
    }
    if ('bio' in request.body) {
      if (!request.body.bio) errors.push('bio cannot be empty');
    }
    if ('userName' in request.body) {
      if (!request.body.userName) errors.push('userName cannot be empty');
    }
    if ('twitterHandle' in request.body) {
      if (!request.body.twitterHandle) {
        errors.push('twitterHandle cannot be empty');
      }
    }
    if ('facebookHandle' in request.body) {
      if (!request.body.facebookHandle) {
        errors.push('facebookHandle cannot be empty');
      }
    }
    if (errors.length > 0) {
      return Helper.failResponse(response, 400, errors[0]);
    }
    const userInstance = await findUserById(request.user.id);
    if (!userInstance) {
      return Helper.failResponse(response, 404, {
        message: 'User account does not exist'
      });
    }
    if (Object.keys(request.body).length < 1) {
      return Helper.failResponse(response, 400, {
        message: 'Field(s) to update cannot be empty'
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
