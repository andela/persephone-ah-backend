import {
  getAllUsersService,
  adminCreateUserService,
  adminDeleteUserService,
  adminUpdateUserService,
  followUserService,
  getUserFollowersService
} from '../services/user.service';
import { isUserExist } from '../services/auth.service';
import Helper from '../services/helper';

/**
 * @description Get list of all users
 *Route: GET: /users/
 *
 * @param {object} request request object
 * @param {object} response response object
 * @param {object} next response object
 *
 * @returns {Response} response object
 */
const getUsers = async (request, response) => {
  try {
    const value = await getAllUsersService();

    return Helper.successResponse(response, 200, value);
  } catch (error) {
    /* istanbul ignore next */
    return Helper.failResponse(response, 400, error);
  }
};
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

/**
 * @method followUser
 * -  user to follow another user
 * Route: POST: /users/follow
 *
 * @param {Object} request request object
 * @param {Object} response response object
 *
 * @returns {Response} response object
 */

const followUser = async (request, response) => {
  try {
    const userId = request.user.id;
    const friendUserId = request.body.userId;

    const value = await followUserService(
      userId,
      parseInt(friendUserId, Number)
    );
    return Helper.successResponse(response, 200, value);
  } catch (error) {
    return Helper.failResponse(response, 400, 'user does not exist');
  }
};

/**
 * @method getFollowers
 * -  get the list of a user followers
 * Route: GET: /users/follow
 *
 * @param {Object} request request object
 * @param {Object} response response object
 *
 * @returns {Response} response object
 */

const getFollowers = async (request, response, next) => {
  try {
    const { userId } = request.params;

    const value = await getUserFollowersService(parseInt(userId, Number));

    return Helper.successResponse(response, 200, value);
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  followUser,
  getFollowers
};
