import {
  adminCreateUserService,
  adminUpdateUserService,
  adminDeleteUserService
} from '../services/user.service';
import Helper from '../services/helper';
import { isUserExist } from '../services/auth.service';
/**
 * format
 * @param {object} response
 * @param {object} request
 * @returns {object}
 */

/**
 * @method adminCreateUser
 * - super admin creates a new admin
 * - validate user input
 * - returns user data with a generated token
 * Route: POST: /users/signup
 *
 * @param {Object} request request object
 * @param {Object} response response object
 *
 * @returns {Response} response object
 */

const adminCreateUser = async (request, response) => {
  try {
    const result = await isUserExist(request.body.email.toLowerCase());
    if (result) {
      return Helper.failResponse(response, 409, 'user already exists');
    }

    const value = await adminCreateUserService(request.body);
    return Helper.successResponse(response, 201, value.user);
  } catch (error) {
    return Helper.errorResponse(response, 500);
  }
};

/**
 * @method adminUpdateUser
 * -  admin update profile
 * - validate user input
 * - returns user data
 * Route: POST: /users/signup
 *
 * @param {Object} request request object
 * @param {Object} response response object
 *
 * @returns {Response} response object
 */

const adminUpdateUser = async (request, response, next) => {
  try {
    const { userId } = request.params;
    const userDetails = request.body;
    const updateUser = await adminUpdateUserService(userId, userDetails);

    if (!updateUser) {
      return Helper.failResponse(response, 400, 'User not found');
    }
    return Helper.successResponse(response, 200, updateUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @method adminUpdateUser
 * -  admin update profile
 * - validate user input
 * - returns user data
 * Route: POST: /users/signup
 *
 * @param {Object} request request object
 * @param {Object} response response object
 *
 * @returns {Response} response object
 */

const adminDeleteUser = async (request, response) => {
  try {
    const { userId } = request.params;
    const value = await adminDeleteUserService(parseInt(userId, Number));

    if (!value) {
      return Helper.failResponse(response, 400, 'User not found');
    }
    return Helper.successResponse(response, 200, value);
  } catch (error) {
    return Helper.errorResponse(response, 500);
  }
};

export default { adminCreateUser, adminUpdateUser, adminDeleteUser };
