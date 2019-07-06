import {
  loginService,
  signUpService,
  isUserExist,
  forgotPasswordServices,
  passwordResetServices,
  saveToBlackListServices
} from '../services/auth.service';
import Helper from '../services/helper';
import upload from '../helpers/image.helper';

const { failResponse, successResponse } = Helper;

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
      return Helper.errorResponse(response, 500, error);
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
        return failResponse(response, 404, {
          message: 'email does not exist'
        });
      }

      forgotPasswordServices(result);
      return successResponse(response, 200, {
        message: 'kindly check your mail for password reset instructions'
      });
    } catch (error) {
      return failResponse(response, 500, {
        message: 'internal server error'
      });
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
    const { password, decoded, token } = request.body;

    await passwordResetServices(decoded.email, password);
    await saveToBlackListServices(token);

    return successResponse(response, 200, {
      message: 'password reset was successful'
    });
  },

  /**
   *
   * @description Handles the Logic for Updating a User profile
   *  Route: PUT: /users/profileupdate
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object}JSON API Response
   */
  async profileUpdate(request, response, next) {
    try {
      let imagePath;
      const previousImage = request.foundUser.image;
      let imageUniqueName;
      let uploadedImage;
      if (request.file) {
        imagePath = request.file.path;
        imageUniqueName = request.file.originalname;
        const imageResponse = await upload(imagePath, imageUniqueName);
        uploadedImage = imageResponse.secure_url;
      }

      const fields = {
        ...request.body,
        image: uploadedImage || previousImage
      };
      const updatedUser = await request.foundUser.update(fields);

      return Helper.successResponse(response, 200, {
        firstName: updatedUser.dataValues.firstName,
        lastName: updatedUser.dataValues.lastName,
        bio: updatedUser.dataValues.bio,
        userName: updatedUser.dataValues.userName,
        twitterHandle: updatedUser.dataValues.twitterHandle,
        facebookHandle: updatedUser.dataValues.facebookHandle,
        image: updatedUser.dataValues.image
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @method logout
   * Handles the Logic for user logout
   *  Route: GET: /users/logout
   * @param {object} request
   * @param {object} response
   * @returns {object} JSON API Response
   */

  async logout(request, response) {
    const { token } = request;

    const result = await saveToBlackListServices(token);
    if (result) {
      return successResponse(response, 200, {
        message: 'logout was successful'
      });
    }
    return failResponse(response, 500, 'internal error');
  }
};
