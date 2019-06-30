import Helper from '../services/helper';
import authService from '../services/auth.services';
import sendEmail from '../helpers/mail.helper';
import { worker } from 'cluster';

const signUp = async (request, response) => {
  const value = await authService.signUpService(request.body);
  const { firstName, email } = value.user;
  sendEmail(firstName, email, 'Welcome Mail');
  return response.status(201).json(value);
};

const login = async (request, response) => {
  const value = await authService.loginService(request.body);
  if (value) {
    return response.status(201).json(value);
  } else {
    return response.status(400).json({
      Error: 'Invalid credentials'
    });
  }
};

export default { signUp, login };
