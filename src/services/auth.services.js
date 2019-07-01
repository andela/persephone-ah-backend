import { getToken, getPasswordResetToken } from '../helpers/jwt.helper';

import model from '../db/models';
import {
  sendWelcomeEmail,
  sendForgotPasswordMail
} from '../helpers/mail.helper';

const { User } = model;

export const signUpService = async body => {
  const { firstName, lastName, email, password } = body;
  const sanitizedEmail = email.toLowerCase();
  const result = await User.create({
    firstName,
    lastName,
    password,
    email: sanitizedEmail
  });
  const user = {
    firstName: result.firstName,
    lastName: result.lastName,
    email: result.email,
    img: result.image,
    token: getToken(result)
  };

  sendWelcomeEmail(
    result.firstName,
    result.email,
    'Welcome Mail',
    'welcome-mail',
    result.confirmEmailCode
  );

  return { user };
};

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

export const isUserExist = userEmail =>
  User.findOne({ where: { email: userEmail } });

export const forgotPasswordServices = async user => {
  const token = await getPasswordResetToken(user);
  const url = `http://localhost:3000/api/v1/users/password_reset?token=${token}`;

  sendForgotPasswordMail(
    user.firstName,
    user.email,
    'Instruction to reset password',
    'password-reset',
    url
  );
};

export const passwordResetServices = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  user.update({ password });
};
