import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../db/models';

const { User } = models;

dotenv.config();

export default {
  async verifyToken(request, response, next) {
    // get token
    const token = request.headers['x-access-token'];
    if (!token) {
      return response.status(401).json({
        status: 401,
        error: 'not authorized'
      });
    }
    try {
      const decode = await jwt.verify(token, process.env.SECRET);
      if (!decode) {
        return response.status(500).json({
          status: 500,
          error: 'failed to authenticate token'
        });
      }
      // find user with token
      const { user } = await User.findOne({ where: { email: decode.email } });
      if (user) {
        return response.status(400).json({
          status: 400,
          error: 'invalid token provided'
        });
      }
      request.user = { id: decode.userId };
      next();
    } catch (error) {
      return response.status(400).json({
        status: 400,
        error: 'token has expired'
      });
    }
  }
};
