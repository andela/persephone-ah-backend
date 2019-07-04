import {
  loginService,
  signUpService,
  isUserExist,
  forgotPasswordServices,
  passwordResetServices
} from '../services/auth.service';
import Helper from '../services/helper';

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @returns
 */

export default {
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

  async signUp(request, response) {
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
  },

  /**
   * @method login
   * - logs in a user
   * - validate user input
   * - returns user data with a generated token
   * Route: POST: /users/login
   *
   * @param {Object} request request object
   * @param {Object} response response object
   *
   * @returns {Response} response object
   */

  async login(request, response) {
    const value = await loginService(request.body);
    if (value) {
      return Helper.successResponse(response, 200, value.user);
    }
    return Helper.failResponse(response, 400, {
      message: 'Invalid email/password'
    });
  },

  /**
   * @method forgotPassword
   * - Handles request made to the forgot_password route
   * Route: POST: /users/forgot_password
   *
   * @param {object} request - request object
   * @param {object} response - response object
   *
   * @returns {Response} response object
   */

  async forgotPassword(request, response) {
    try {
      const result = await isUserExist(request.body.email.toLowerCase());

      if (!result) {
        return response.status(404).json({
          status: 'error',
          error: { message: 'email does not exist' }
        });
      }

      forgotPasswordServices(result);
      return response.status(201).json({
        status: 'success',
        data: {
          message: 'kindly check your mail for password reset instructions'
        }
      });
    } catch (error) {
      return response
        .status(500)
        .json({ status: 'error', error: { message: 'internal server error' } });
    }
  },

  /**
   * @method passwordReset
   * - Handles request made to the password reset endpoint
   * Route: POST: /users/password_reset
   *
   * @param {object} request
   * @param {object} response
   * @returns {object} response object for the password request
   */

  async passwordReset(request, response) {
    const { password, decoded } = request.body;

    await passwordResetServices(decoded.email, password);

    return response.status(200).json({
      status: 'success',
      data: {
        message: 'password reset was successful'
      }
    });
  }
};
