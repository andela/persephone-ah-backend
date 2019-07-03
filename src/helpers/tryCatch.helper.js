/**
 * @description Wraps a controller function in a try-catch block
 * 
 * @param  {object} request request object
 * @param  {object} response response object
 * 
 * @returns {response} response object
 */

/* istanbul ignore next */
const tryCatch = controller => async (request, response) => {
  try {
    await controller(request, response);
  } catch (error) {
    return response
      .status(500)
      .json({ status: 'error', message: error.message });
  }
};

export default tryCatch;
