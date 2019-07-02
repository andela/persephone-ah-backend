import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../db/models';

const { User } = models;

dotenv.config();

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @param {function} next
 * @returns
 */

export const verifyToken = async (request, response, next) => {
  // get token
  const token = request.headers.authorization.split(' ')[1];
  if (!token) {
    return response.status(401).json({
      status: 401,
      error: 'You do not have access to this resource, unauthorized'
    });
  }
  try {
    const decode = await jwt.verify(token, process.env.SECRET);
    if (!decode.email) {
      return response.status(400).json({
        status: 400,
        error: 'You have provide an invalid token'
      });
    }
    // find user with token
    const { user } = await User.findOne({ where: { email: decode.email } });
    request.user = user;
    next();
  } catch (error) {
    return response.status(400).json({
      status: 400,
      error: error.message
    });
  }
};
export const isAdmin = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    return response.status(403).json({
      message: 'You do not have access to this resource, unauthorized'
    });
  }
  next();
};

export const isSuperAdmin = async (request, response, next) => {
  if (request.user.role !== 'super_admin') {
    return response.status(403).json({
      message: 'You do not have access to this resource, unauthorized'
    });
  }
  next();
};
