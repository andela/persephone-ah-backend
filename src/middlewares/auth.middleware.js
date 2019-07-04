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
   * - it implement jwt's verify method to decode incoming request with token
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
        status: 403,
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
    if (request.user.roleType !== 'super_admin') {
      return response.status(403).json({
        status: 403,
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

  async adminCheck(request, response, next) {
    const admin =
      request.user.roleType === 'super_admin' ||
      request.user.roleType === 'admin';
    if (!admin) {
      return response.status(403).json({
        status: 403,
        message: 'You do not have access to this resource, unauthorized'
      });
    }
    next();
  }
};
