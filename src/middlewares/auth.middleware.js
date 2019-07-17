import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { isTokenInBlackListService } from '../services/auth.service';
import model from '../db/models';

const { Article, User } = model;

dotenv.config();

/**
 *
 *  Middleware Utils module
 *
 */
/* istanbul ignore next */
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

      const checkIfTokenWasLoggedOut = await isTokenInBlackListService(token);

      if (checkIfTokenWasLoggedOut) {
        return response.status(401).json({
          status: 'error',
          error: {
            message: 'kindly sign in as the token used has been logged out'
          }
        });
      }
      request.user = decode;
      request.token = token;
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

      const checkIfTokenHasBeenUsed = await isTokenInBlackListService(token);
      if (checkIfTokenHasBeenUsed) {
        return response.status(401).json({
          status: 'error',
          error: {
            message: 'this token has been used kindly request for a new one'
          }
        });
      }

      if (decoded) {
        request.body.decoded = decoded;
        request.body.token = token;
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
    if (request.user.roleType !== 'admin') {
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
    if (request.user.roleType !== 'super_admin') {
      return response.status(403).json({
        message: 'You do not have access to this resource, unauthorized'
      });
    }
    next();
  },

  /**
   * @method adminCheck
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
    if (
      !(
        request.user.roleType === 'super_admin' ||
        request.user.roleType === 'admin'
      )
    ) {
      return response.status(403).json({
        status: 'fail',
        message: 'You do not have access to this resource, unauthorized'
      });
    }
    next();
  },

  /**
   * @method isAuthor
   * - it checks if user is an author an article
   * - returns next()
   *
   * @param {Object} request request object
   * @param {Object} response response object
   * @param {Function} next function
   *
   * @returns {Response} response object
   */

  async isAuthor(request, response, next) {
    const { slug } = request.params;
    const author = await Article.findOne({
      where: {
        slug
      }
    });
    if (author) {
      request.authorId = author.userId;
    }
    next();
  },

  /**
   * @method verifyUser
   * - it checks if user has confirm email
   * - returns next()
   *
   * @param {Object} request request object
   * @param {Object} response response object
   * @param {Function} next function
   *
   * @returns {Response} response object
   */

  async verifyUser(request, response, next) {
    const user = await User.findOne({
      where: { id: request.user.id, confirmEmail: true }
    });
    if (!user) {
      return response.status(403).json({
        status: 'fail',
        message: 'Please confirm your email'
      });
    }
    next();
  }
};
