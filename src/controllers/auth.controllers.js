import { validationResult } from 'express-validator';
import Helper from '../services/helper';
import authService from '../services/auth.services';

const signUp = async (request, response) => {
  const value = await authService.authService(request.body);
  return response.status(201).json(value);
};

export default { signUp };
