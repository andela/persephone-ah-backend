import {
  loginService,
  signUpService,
  isUserExist
} from '../services/auth.service';
import Helper from '../services/helper';
/**
 * format
 * @param {object} response
 * @param {object} request
 * @returns {object}
 */

/**
 * @method signUp
 * - create a new user
 * - validate user input
 * - returns user data with a generated token
 * Route: POST: /users/signup
 *
 * @param {Object} request request object
 * @param {Object} response response object
 *
 * @returns {Response} response object
 */

const signUp = async (request, response) => {
  try {
    const result = await isUserExist(request.body.email.toLowerCase());
    if (result) {
      return Helper.failResponse(response, 409, {
        message: 'user already exists'
      });
    }

    const value = await signUpService(request.body);
    return Helper.successResponse(response, 201, value.user);
  } catch (error) {
    return Helper.errorResponse(response, 500);
  }
};

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @returns
 */

const login = async (request, response) => {
  const value = await loginService(request.body);
  if (value) {
    return Helper.successResponse(response, 200, value.user);
  }
  return Helper.failResponse(response, 400, {
    message: 'Invalid email/password'
  });
};

export default { signUp, login };
