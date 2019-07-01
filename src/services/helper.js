import dotenv from 'dotenv';

dotenv.config();

const Helper = {
  /**
   * Error format
   * @param {string} response
   * @param {string} statusCode
   * @param {string} errors
   * @returns {object} error format
   */
  errorResponse(response, statusCode, errors) {
    return response.status(statusCode).json({
      status: 'error',
      errors
    });
  }
};

export default Helper;
