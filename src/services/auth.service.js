import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import moment from 'moment';
import cron from 'node-cron';
import { getToken, getPasswordResetToken } from '../helpers/jwt.helper';
import model from '../db/models';
import {
  sendWelcomeEmail,
  sendForgotPasswordMail
} from '../helpers/mail.helper';

const { User, BlackList } = model;

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
  const image = process.env.DEFAULT_IMAGE_URL;
  const result = await User.create({
    firstName,
    lastName,
    password: hashedPassword,
    email: sanitizedEmail,
    confirmEmailCode,
    image,
    roleType: role
  });
  const user = {
    firstName: result.firstName,
    lastName: result.lastName,
    email: result.email,
    image: result.image,
    token: getToken(result),
    userName: result.userName,
    bio: result.bio,
    id: result.id,
    isNotified: result.isNotified
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
    const {
      id,
      firstName,
      lastName,
      image,
      bio,
      userName,
      isNotified
    } = result;
    const token = await getToken(result);
    const user = {
      id,
      firstName,
      lastName,
      email: result.email,
      token,
      image,
      bio,
      userName,
      isNotified
    };
    return { user };
  }
};

/**
 * @method findUserById
 * Queries the database to find a user using the provided id
 * @param {number} userId
 * @returns {object}  Database User Instance
 */

export const findUserById = async userId => User.findByPk(userId);

/**
 * @method isUserExist
 * - it persist a new user to the database
 * - returns a promise
export const findUserById = async userId => User.findByPk(userId);

/**
 * @method isUserExist
 * - it persist a new user to the database
 * - returns a promise
export const findUserById = async userId => User.findByPk(userId);

/**
 * @method isUserExist
 * - it check if user exist in the database
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
 * - Helps generate password reset token and sends mail to the user's email Address containing token and link
 * @param {object} user - contains required user info to generate password reset token
 * @returns {promise}
 */

export const forgotPasswordServices = async user => {
  const token = await getPasswordResetToken(user);
  const url = `${process.env.FRONTEND_URL}/password_reset?token=${token}`;

  sendForgotPasswordMail(
    user.firstName,
    user.email,
    'Instruction to reset password',
    'password-reset',
    url
  );
};

/**
 * @method saveToBlackListServices
 * - Helps save token in the blacklist table
 *
 * @param {string} userToken - jwt token
 * @param {string} tokenType - user token or password reset token
 * @returns {object}
 */

export const saveToBlackListServices = async (userToken, tokenType) => {
  const result = BlackList.create({ userToken, tokenType });
  return result;
};

/**
 * @method passwordResetServices
 * Helps update user's password
 *
 * @param {string} email - user's email address
 * @param {string} newPassword - new password t be updated
 * @returns {object}
 */

export const passwordResetServices = async (email, newPassword) => {
  const hashedPassword = await hashPassword(newPassword);

  const user = await User.findOne({ where: { email } });

  user.update({ password: hashedPassword });
};

/**
 *@method findByUserName
 * Queries the database to find user using the provided username
 * @param {string} userName
 * @returns {(object|boolean)} Database User Instance or boolean if user is not found
 */

export const findByUserName = async userName => {
  const result = await User.findOne({ where: { userName } });
  if (!result) return false;
  return result;
};

/**
 * @method isTokenInBlackListService
 * - Helps check the blackList table for specified token
 *
 * @param {string} userToken - jwt token
 * @returns {object}
 */

export const isTokenInBlackListService = async userToken =>
  BlackList.findOne({
    where: { userToken }
  });

export const getExpiredToken = async () => {
  const tokens = await BlackList.findAll();
  const expiredToken = [];

  tokens.forEach(token => {
    const { userToken, createdAt } = token;
    const now = moment();
    const oneDay = 60 * 60 * 24 * 1000;

    if (now - createdAt > oneDay) {
      expiredToken.push(userToken);
    }
  });

  return expiredToken;
};

export const cronJob = () => {
  cron.schedule('0 0 * * *', () => {
    getExpiredToken().then(tokens => {
      tokens.forEach(token => {
        BlackList.destroy({
          where: {
            userToken: token
          }
        });
      });
    });
  });
};

/**
 *  @method isVerifyUser
 * - it check if user confimation code is in the database
 * - returns a promise
 *
 * @param {String} emailConfirmCode user's confirmation code
 *
 * @returns {Promise}
 */

export const isVerifyUser = async emailConfirmCode => {
  await saveToBlackListServices(emailConfirmCode, 'emailConfirmationCode');
  const user = User.findOne({ where: { confirmEmailCode: emailConfirmCode } });
  return user;
};
