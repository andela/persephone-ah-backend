import Pusher from 'pusher';
import dotenv from 'dotenv';
import models from '../db/models';
import { findUserById } from './auth.service';
import { getUserFollowersService } from './user.service';

dotenv.config();

const { Notification, Follow } = models;

/**
 * @method pusher
 * @description method for pusher detials
 */
const pusher = new Pusher({
  appId: process.env.PusherAppId,
  key: process.env.PusherKey,
  secret: process.env.PusherSecret,
  cluster: process.env.PusherCluster,
  encrypted: process.env.PusherEncrypted
});

/**
 * @method pushNotification
 * @description methid that triggers the event
 *
 * @param {Object} receiver receiver details
 * @param {Object} message message to be sent
 *
 * @returns {Object} true or false
 */
const pushNotification = (receiver, message) => {
  return pusher.trigger('notification', `event-${receiver.userName}`, {
    message
  });
};

/**
 * @method fetchNotificationService
 * @description method that fetches all notifications
 *
 * @param {Object} request receiver details
 *
 * @returns {Object} true or false
 */
export const fetchNotificationService = async request => {
  const userId = request.user.id;
  // notifications
  try {
    const findNotification = await Notification.findAll({
      where: {
        receiverUserId: userId
      }
    });
    return findNotification;
  } catch (error) {
    throw Error(error);
  }
};

/**
 * @method createNotificationMessage
 * @description persist data into the Notification table
 *
 * @param {Object} messageDetails details of what to save id the notification table
 *
 * @returns {Object} notification data object
 */

const createNotificationMessage = async messageDetails => {
  const newNotification = await Notification.create(messageDetails);
  return newNotification;
};

/**
 * @method followNotification
 * @description create a notification when users follow each other
 *
 * @param {Object} userId userId of logged in user
 * @param {Object} friendUserId user if of who the user followed
 *
 * @returns {Boolean} true or false
 */

export const followNotification = async (userId, friendUserId) => {
  try {
    const sender = await findUserById(userId);
    const receiver = await findUserById(friendUserId);
    if (receiver.isNotified) {
      const message = `${sender.firstName} is now following you`;
      const link = `/profiles/${sender.userName}`;
      const messageDetails = {
        senderUserId: sender.id,
        receiverUserId: receiver.id,
        notificationMessage: message,
        link
      };
      pushNotification(receiver, message);

      const savedNotification = await createNotificationMessage(messageDetails);
      return !!savedNotification;
    }
    return false;
  } catch (error) {
    const response = { message: 'something went wrong' };
    return response;
  }
};

/**
 * @method commentArticleNotification
 * @description create a notification when a user comment on an article
 *
 * @param {Object} details details of the notification to be sent
 *
 * @returns {Boolean} true or false
 */
export const commentArticleNotification = async details => {
  try {
    const { userId, commentUserId, articleSlug, commentId } = details;
    const sender = await findUserById(commentUserId);
    const receiver = await findUserById(userId);

    if (receiver.isNotified) {
      const message = `${sender.firstName} commented on your article`;
      const link = `/articles/${articleSlug}/comments/${commentId}`;
      const messageDetails = {
        senderUserId: commentUserId,
        receiverUserId: receiver.dataValues.id,
        notificationMessage: message,
        link
      };

      pushNotification(receiver, message);

      const savedNotification = await createNotificationMessage(messageDetails);
      return !!savedNotification;
    }
    return false;
  } catch (error) {
    const response = { message: 'something went wrong' };
    return response;
  }
};

/**
 * @method likeArticleNotification
 * @description create a notification when a user likes an article
 *
 * @param {Object} details details of the notification to be sent
 *
 * @returns {Boolean} true or false
 */
export const likeArticleNotification = async details => {
  try {
    const { userId, likeUserId, articleSlug } = details;

    const sender = await findUserById(likeUserId);
    const receiver = await findUserById(userId);

    if (receiver.isNotified) {
      const message = `${sender.firstName} liked your article`;
      const link = `/articles/${articleSlug}`;
      const messageDetails = {
        senderUserId: sender.dataValues.id,
        receiverUserId: receiver.dataValues.id,
        notificationMessage: message,
        link
      };

      pushNotification(receiver, message);

      const savedNotification = await createNotificationMessage(messageDetails);
      return !!savedNotification;
    }
    return false;
  } catch (error) {
    const response = { message: 'something went wrong' };
    return response;
  }
};

/**
 * @method likeCommentNotification
 * @description create a notification when a user likes a comment
 *
 * @param {Object} details details of the notification to be sent
 *
 * @returns {Boolean} true or false
 */
export const likeCommentNotification = async details => {
  try {
    const { userId, likeUserId, articleSlug, commentId } = details;
    const sender = await findUserById(likeUserId);
    const receiver = await findUserById(userId);

    if (receiver.isNotified) {
      const message = `${sender.firstName} liked your comment`;
      const link = `/articles/${articleSlug}/comments/${commentId}`;
      const messageDetails = {
        senderUserId: sender.id,
        receiverUserId: receiver.id,
        notificationMessage: message,
        link
      };

      pushNotification(receiver, message);

      const savedNotification = await createNotificationMessage(messageDetails);
      return !!savedNotification;
    }
    return false;
  } catch (error) {
    const response = { message: 'something went wrong' };
    return response;
  }
};

/**
 * @method likeCommentNotification
 * @description create a notification when a user likes a comment
 *
 * @param {Object} details details of the notification to be sent
 *
 * @returns {Boolean} true or false
 */
export const sendNotificationOnArticlePublish = async details => {
  try {
    const { publisherUserId, articleSlug } = details;
    const sender = await findUserById(publisherUserId);
    const followers = await getUserFollowersService(publisherUserId);

    const followersUserId = followers.map(fol => {
      return fol.dataValues.friendUserId;
    });
    await followersUserId.forEach(async userId => {
      const receiver = await findUserById(userId);
      if (receiver.isNotified) {
        const message = `${sender.firstName} published an article`;
        const link = `/articles/${articleSlug}`;
        const messageDetails = {
          senderUserId: sender.id,
          receiverUserId: receiver.id,
          notificationMessage: message,
          link
        };
        pushNotification(receiver, message);

        const savedNotification = await createNotificationMessage(
          messageDetails
        );
        return !!savedNotification;
      }
      return false;
    });
    return false;
  } catch (error) {
    const response = { message: 'something went wrong' };
    return response;
  }
};

/**
 * @method readNotificationService
 * @description read a notification
 *
 * @param {Object} details details of the notification to be sent
 *
 * @returns {Boolean} true or false
 */
export const readNotificationService = async details => {
  try {
    const { notificationId } = details;
    const readNotification = await Notification.findOne({
      where: { id: notificationId }
    });
    readNotification.update({ isRead: true });
    const response = { message: 'you have read the notification' };
    return response;
  } catch (error) {
    const response = { message: 'something went wrong' };
    return response;
  }
};
