import { validationResult } from 'express-validator';
import Helper from '../services/helper';
import  authService  from '../services/auth.services'


const signUp = async (request, response) => {
    const errors = validationResult(request);
    console.log(errors);
    if (!errors.isEmpty()) {
      return Helper.errorResponse(response, 422, errors);
    }
	const value =  await authService.authService(request.body);
	return response.status(201).json(value)
};

export default { signUp };
