import jwt from 'jsonwebtoken';

const dotenv = require('dotenv');

dotenv.config();
/**
 *
 *
 * @param {object} user
 * @returns
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
