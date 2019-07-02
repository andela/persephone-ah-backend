import bcrypt from 'bcryptjs';
import getToken from '../helpers/jwt.helper';
import model from '../db/models';
import sendWelcomeEmail from '../helpers/mail.helper';

const { User } = model;
/**
 * @param {object} body
 * @returns
 */
export const signUpService = async body => {
  const { firstName, lastName, email, password, role } = body;
  const sanitizedEmail = email.toLowerCase();
  const image = process.env.DEFAULT_IMAGE_URL;
  const result = await User.create({
    firstName,
    lastName,
    password,
    email: sanitizedEmail,
    image,
    roleType: role
  });
  const user = {
    firstName: result.firstName,
    lastName: result.lastName,
    email: result.email,
    image: result.image,
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
 *
 *
 * @param {object} body
 * @returns
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
      email,
      token
    };
    return { user };
  }
};

export const isUserExist = async userEmail =>
  await User.findOne({ where: { email: userEmail } });
/**
 *@method findUserById
 * Queries the database to find a user using the provided id
 * @param {number} userId
 * @returns {object}  Database User Instance
 */
export const findUserById = async userId => await User.findByPk(userId);

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
