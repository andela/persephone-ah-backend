import {
  loginService,
  signUpService,
  isUserExist
} from '../services/auth.service';
import Helper from '../services/helper';
import { upload } from '../helpers/image.helper';

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

const login = async (request, response) => {
  const value = await loginService(request.body);
  if (value) {
    return Helper.successResponse(response, 200, value.user);
  }
  return Helper.failResponse(response, 400, {
    message: 'Invalid email/password'
  });
};

/**
 *
 * @description Handles the Logic for Updating a User profile
 *  Route: PUT: /users/profileupdate
 * @param {object} request
 * @param {object} response
 * @returns JSON API Response
 */
const profileUpdate = async (request, response, next) => {
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
    const {
      firstName,
      lastName,
      bio,
      twitterHandle,
      facebookHandle,
      image,
      userName
    } = updatedUser;
    return Helper.successResponse(response, 200, {
      firstName,
      lastName,
      bio,
      userName,
      twitterHandle,
      facebookHandle,
      image
    });
  } catch (error) {
    next(error);
  }
};

export default { signUp, login, profileUpdate };
