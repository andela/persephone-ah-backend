import {
  loginService,
  signUpService,
  isUserExist
} from '../services/auth.service';
import Helper from '../services/helper';

const signUp = async (request, response) => {
  try {
    const result = await isUserExist(request.body.email.toLowerCase());
    if (result) {
      return Helper.failResponse(response, 409, {
        message: 'user already exists'
      });
    }

    const value = await signUpService(request.body);
    return Helper.successResponse(response, 201, value);
  } catch (error) {
    return Helper.errorResponse(response, 500);
  }
};

const login = async (request, response) => {
  const value = await loginService(request.body);
  if (value) {
    return Helper.successResponse(response, 200, value);
  }
  return Helper.failResponse(response, 400, {
    message: 'Invalid email/password'
  });
};

export default { signUp, login };
