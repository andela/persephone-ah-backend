import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import getToken from '../helpers/jwt.helper';
import model from '../db/models';
import sendWelcomeEmail from '../helpers/mail.helper';

const { User } = model;

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
  const hashedPassword = bcrypt.hashSync(password, 10);
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
