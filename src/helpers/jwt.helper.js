import jwt from 'jsonwebtoken';

const dotenv = require('dotenv');

dotenv.config();

/**
 * @method getToken
 * - it implement jwt to sign user object
 * - returns a generated token
 *
 * @param {Object} user user's data object containing email, id, roleType
 *
 * @returns {Response} object
 */

export const getToken = user => {
  return jwt.sign(
    { id: user.id, email: user.email, roleType: user.roleType },
    process.env.SECRET,
    {
      expiresIn: '12h'
    }
  );
};

/**
 * Helps generate a token for password reset
 *
 * @param {object} user - user object as payload
 *@returns {string} new jwt token
 */
export const getPasswordResetToken = user => {
  return jwt.sign({ email: user.email }, process.env.PASSWORD_RESET_SECRET, {
    expiresIn: '2h'
  });
};
