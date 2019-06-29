import { validationResult } from 'express-validator';
import Helper from '../services/helper';
<<<<<<< HEAD
import  authService  from '../services/auth.services'


const signUp = async (request, response) => {
	const value =  await authService.signUpService(request.body);
	return response.status(201).json(value)
=======
import authService from '../services/auth.services';

const signUp = async (request, response) => {
  const value = await authService.authService(request.body);
  return response.status(201).json(value);
>>>>>>> cc313268d6f8f5b773f0c2c664c853a8e97ac2d6
};

export default { signUp };
