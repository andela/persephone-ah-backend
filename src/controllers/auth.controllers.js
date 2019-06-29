import Helper from '../services/helper';
import  authService  from '../services/auth.services'
import sendEmail from '../helpers/mail.helper';


const signUp = async (request, response) => {
  const value =  await authService.signUpService(request.body);
  const { firstName, email } = value.user;
  sendEmail(firstName, email, 'Welcome Mail')
	return response.status(201).json(value)
};

export default { signUp };
