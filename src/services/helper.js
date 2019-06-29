import dotenv from 'dotenv';

dotenv.config();

const Helper = {
  /**
   * Error format
   * @param {string} res
   * @param {string} statusCode
   * @param {string} error
   * @returns {object} error format
   */
  errorResponse(response, statusCode, errors) {
    return response.status(statusCode).json({
      errors
    });
  }
};

export default Helper;
