import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 *
 *  Middleware Utils module
 *
 */

export default {
  /**
   * @method verifyToken
   * - it implement jwt verify method to decode incoming request with token
   * - returns user data with a generated token
   *
   * @param {Object} request request object
   * @param {Object} response response object
   * @param {Function} next function
   *
   * @returns {Response} response object
   */

  async verifyToken(request, response, next) {
    try {
      if (!request.headers.authorization) {
        throw new Error(
          'No token provided, you do not have access to this page'
        );
      }
      // get token
      const token = request.headers.authorization.split(' ')[1];

      const decode = await jwt.verify(token, process.env.SECRET);
      if (!decode.email) {
        return response.status(400).json({
          status: 400,
          error: 'You have provide an invalid token'
        });
      }
      request.user = decode;
      next();
    } catch (error) {
      return response.status(400).json({
        status: 400,
        error: error.message
      });
    }
  },

  /**
   * @method verifyPasswordResetToken
   * - Confirms the token passed is valid
   *
   * @param {object} request - request object
   * @param {object} response - response object
   * @param {function} next - When called it moves to the next function
   * @returns {object} response - for error case
   */

  async verifyPasswordResetToken(request, response, next) {
    const { token } = request.query;

    try {
      const decoded = await jwt.verify(
        token,
        process.env.PASSWORD_RESET_SECRET
      );

      if (decoded) {
        request.body.decoded = decoded;
        next();
      }
    } catch (error) {
      return response.status(401).json({
        status: 'error',
        error: {
          message: 'Authentication error',
          body: 'invalid or expired token'
        }
      });
    }
  },

  /**
   * @method isAdmin
   * - it checks if user is an admin
   * - returns next()
   *
   * @param {Object} request request object
   * @param {Object} response response object
   * @param {Function} next function
   *
   * @returns {Response} response object
   */

  async isAdmin(request, response, next) {
    if (request.user.role !== 'admin') {
      return response.status(403).json({
        message: 'You do not have access to this resource, unauthorized'
      });
    }
    next();
  },

  /**
   * @method isSuperAdmin
   * - it checks if user is a super_admin
   * - returns next()
   *
   * @param {Object} request request object
   * @param {Object} response response object
   * @param {Function} next function
   *
   * @returns {Response} response object
   */

  async isSuperAdmin(request, response, next) {
    if (request.user.role !== 'super_admin') {
      return response.status(403).json({
        message: 'You do not have access to this resource, unauthorized'
      });
    }
    next();
  }
};
