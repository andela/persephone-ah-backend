import {
  fetchNotificationService,
  readNotificationService
} from '../services/notification.service';
import Helper from '../services/helper';

export default {
  /**
     * @method fetchNotification 
       fetches all notifications
     * 
     * @param {*} request
     * @param {*} response
     */

  async fetchNotification(request, response) {
    try {
      const value = await fetchNotificationService(request);
      return Helper.successResponse(response, 200, value);
    } catch (error) {
      return error;
    }
  },

  /**
     * @method readNotification 
       read a notification
     * 
     * @param {*} request
     * @param {*} response
     */

  async readNotification(request, response) {
    try {
      const value = await readNotificationService(request.params);
      return Helper.successResponse(response, 200, value);
    } catch (error) {
      return error;
    }
  }
};
