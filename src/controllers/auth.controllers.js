import  { loginService, signUpService, isUserExist }  from '../services/auth.services';
import Helper from '../services/helper'; 

/**
   * format
   * @param {object} response
   * @param {object} request
   * @returns {object} 
   */
const signUp = async (request, response) => {

  try {
    const result = await isUserExist(request.body.email.toLowerCase());
    if(result) {
       return Helper.failResponse(response, 409, { message: 'user already exists'})
    }

    const value = await signUpService(request.body);
    
    return Helper.successResponse(response, 201, value);

  } catch (error) {
    return Helper.errorResponse(response, 500) 
  }
  
};

const login = async (request, response) => {
  const value = await loginService(request.body);
  if (value) {
    return response.status(200).json(value);
  } else {
    return response.status(400).json({
      message: 'Invalid email/password'
    });
  }
};

export default { signUp, login };
