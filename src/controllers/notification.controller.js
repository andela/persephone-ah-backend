import { fetchNotificationService } from '../services/notification.service';
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
  }
};
