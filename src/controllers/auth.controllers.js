import {
  loginService,
  signUpService,
  isUserExist,
  forgotPasswordServices,
  passwordResetServices
} from '../services/auth.services';

import Helper from '../services/helper';

const signUp = async (request, response) => {
  try {
    const result = await isUserExist(request.body.email.toLowerCase());
    if (result) {
      return Helper.errorResponse(response, 409, {
        message: 'user already exists'
      });
    }

    const value = await signUpService(request.body);

    return response.status(201).json(value);
  } catch (error) {
    return response.status(500).json({ error: 'internal server error' });
  }
};

const login = async (request, response) => {
  const value = await loginService(request.body);
  if (value) {
    return response.status(200).json(value);
  }
  return response.status(400).json({
    message: 'Invalid credentials'
  });
};

/**
 * Handles request made to the forgot_password route
 *
 * @param {object} request
 * @param {object} response
 * @returns {object} response to forgot password endpoint
 */
const forgotPassword = async (request, response) => {
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
        message: 'please check your mail for password reset instructions'
      }
    });
  } catch (error) {
    return response
      .status(500)
      .json({ status: 'error', error: { message: 'internal server error' } });
  }
};

/**
 * Handles request made to the password reset endpoint
 *
 * @param {object} request
 * @param {object} response
 * @returns {object} response object for the password request
 */
const passwordReset = async (request, response) => {
  const { password, decoded } = request.body;

  await passwordResetServices(decoded.email, password);

  return response.status(200).json({
    status: 'success',
    data: {
      message: 'password reset was successful'
    }
  });
};

export default {
  signUp,
  login,
  forgotPassword,
  passwordReset
};
