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
  errorResponse(response, statusCode, error) {
    return response.status(statusCode).json({
      status: statusCode,
      error
    });
  }
};

export default Helper;
