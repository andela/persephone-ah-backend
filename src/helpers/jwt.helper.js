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

const getToken = user => {
  return jwt.sign(
    { id: user.id, email: user.email, roleType: user.roleType },
    process.env.SECRET,
    {
      expiresIn: '12h'
    }
  );
};

export default getToken;
