import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import getToken, { getPasswordResetToken } from '../helpers/jwt.helper';
import model from '../db/models';
import sendWelcomeEmail, {
  sendForgotPasswordMail
} from '../helpers/mail.helper';

const { User } = model;

/**
 * @method hashPassword
 * - it hashes a new user password
 *
 * @param {string} password - plain text of user password
 *
 * @returns {string} hashed password
 */

export const hashPassword = async password => bcrypt.hash(password, 10);

/**
 * @method signUpService
 * - it persist a new user to the database
 * - sends new user a welcome email
 * - returns user data
 *
 * @param {Object} body request body's object
 *
 * @returns {Object} user object
 */

export const signUpService = async body => {
  const { firstName, lastName, email, password, role } = body;
  const sanitizedEmail = email.toLowerCase();
  const hashedPassword = await hashPassword(password);
  const confirmEmailCode = crypto.randomBytes(16).toString('hex');
  const result = await User.create({
    firstName,
    lastName,
    password: hashedPassword,
    email: sanitizedEmail,
    confirmEmailCode,
    roleType: role
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

/**
 * @method loginService
 * - it verifies if user exist in the database
 * - returns user data
 *
 * @param {Object} body request body's object
 *
 * @returns {Object} user object
 */

export const loginService = async body => {
  const { email, password } = body;

  const result = await User.findOne({
    where: { email }
  });
  const validatePassword = plainText => {
    return bcrypt.compareSync(plainText, result.password);
  };
  if (result && validatePassword(password)) {
    const { firstName, lastName } = result;
    const token = await getToken(result);
    const user = {
      firstName,
      lastName,
      email: result.email,
      token
    };
    return { user };
  }
};

/**
 * @method isUserExist
 * - it persist a new user to the database
 * - returns a promise
 *
 * @param {String} userEmail user's email
 *
 * @returns {Promise}
 */

export const isUserExist = async userEmail =>
  User.findOne({ where: { email: userEmail } });

/**
 * @method forgetPasswordServices
 * - Helps generate password reset token and
     sends mail to the user's email Address containing token and link
 * @param {object} user - contains required user info to generate password reset token
 * @returns {undefined}
 */

export const forgotPasswordServices = async user => {
  const token = await getPasswordResetToken(user);
  const url = `${process.env.url}/api/v1/users/password_reset?token=${token}`;

  sendForgotPasswordMail(
    user.firstName,
    user.email,
    'Instruction to reset password',
    'password-reset',
    url
  );
};

/**
 * Helps update user's password
 *
 * @param {string} email - user's email address
 * @param {string} newPassword - new password t be updated
 * @returns {undefined}
 */
export const passwordResetServices = async (email, newPassword) => {
  const hashedPassword = await hashPassword(newPassword);

  const user = await User.findOne({ where: { email } });

  user.update({ password: hashedPassword });
};
