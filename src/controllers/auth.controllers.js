import  { signUpService, isUserExist }  from '../services/auth.services';
import sendEmail from '../helpers/mail.helper'; 
import Helper from '../services/helper';


const signUp = async (request, response) => {
  try {
    const result = await isUserExist(request.body.email)
    if(result) {
       return Helper.errorResponse(response, 409, {message: 'user already exists'})
    }

    const value =  await signUpService(request.body);

    const { firstName, email } = value.user;

    sendEmail(firstName, email, 'Welcome Mail');
    return response.status(201).json(value)
  } catch (error) {
    return response.status(500).json({ error: "internal server error"})
  }
  
};

export default { signUp };
