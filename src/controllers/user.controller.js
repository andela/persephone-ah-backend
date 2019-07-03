import { getAllUsersService } from '../services/user.services';
import Helper from '../services/helper';

/**
 * @description Get list of all users
 *Route: GET: /users/
 *
 * @param {object} request request object
 * @param {object} response response object
 *
 * @returns {Response} response object
 */
const getUsers = async (request, response) => {
  const value = await getAllUsersService();

  return Helper.successResponse(response, 200, value);
};

export default { getUsers };
