import { getToken } from '../helpers/jwt.helper';

import model from '../db/models';
import { sendWelcomeEmail } from '../helpers/mail.helper';

const { User } = model;

export const signUpService =  async body => {
    const { firstName, lastName, email, password, role } = body;
    const sanitizedEmail = email.toLowerCase();
    const result = await User.create({
        firstName,
        lastName,
        password,
        email: sanitizedEmail,
        roleType: role
    });    
    const user = {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        img: result.image,
        token: getToken(result),
    }  
    sendWelcomeEmail(result.firstName, result.email, 'Welcome Mail', 'welcome-mail', result.confirmEmailCode);
    return { user };
}

export const loginService = async body => {
  const { email, password } = body;
  const result = await User.findOne({
    where: { email }
  });
  if (result && result.validatePassword(password)) {
    const { firstName, lastName } = result;
    const token = await getToken(result);
    const user = {
      firstName,
      lastName,
      email,
      token
    };
    return { user };
  }
};

export const isUserExist = async (userEmail) =>  await User.findOne({where: { 'email': userEmail }});
