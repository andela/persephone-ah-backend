import jwt from 'jsonwebtoken';

const dotenv = require('dotenv');

dotenv.config();

export const getToken = user => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, {
    expiresIn: '12h'
  });
};

/**
 * Helps generate a token for password reset
 *
 * @param {object} user - user object as payload
 *@returns {string} New user token
 */
export const getPasswordResetToken = user => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.PASSWORD_RESET_SECRET,
    {
      expiresIn: '2h'
    }
  );
};
