import  { loginService, signUpService, isUserExist }  from '../services/auth.services';
import Helper from '../services/helper'; 


const signUp = async (request, response) => {
  try {
    const result = await isUserExist(request.body.email.toLowerCase());
    if(result) {
       return Helper.errorResponse(response, 409, {message: 'user already exists'})
    }

    const value  =  await signUpService(request.body);

    const { firstName, email, confirmEmailCode } = value.user;
    
    return response.status(201).json(value)
  } catch (error) {
    return response.status(500).json({ error: "internal server error"})
  }
}

const login = async (request, response) => {
  const value = await loginService(request.body);
  if (value) {
    return response.status(200).json(value);
  } else {
    return response.status(400).json({
      message: 'Invalid credentials'
    });
  }
};

export default { signUp, login };
