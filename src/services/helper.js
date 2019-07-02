import dotenv from 'dotenv';

dotenv.config();

const Helper = {
  /**
   * format
   * @param {object} response
   * @param {string} statusCode
   * @param {object} error
   * @param {object} data
   * @returns {object}
   */

  errorResponse(response, statusCode) {
    return response.status(statusCode).json({
      status: 'error',
      message: 'Unable to communicate with database'
    });
  },
  successResponse(response, statusCode, data) {
    return response.status(statusCode).json({
      status: 'success',
      data: { data }
    });
  },
  failResponse(response, statusCode, error) {
    return response.status(statusCode).json({
      status: 'fail',
      data: error
    });
  }
};

export default Helper;
