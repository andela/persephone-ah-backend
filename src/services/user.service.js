import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import getToken from '../helpers/jwt.helper';
import model from '../db/models';
import sendWelcomeEmail from '../helpers/mail.helper';

const { User, Follow } = model;

/**
 * @description Get all users details without password and confirmEmailCode
 *Route: GET: /users/

 * @returns {Object} users object
 */

// eslint-disable-next-line import/prefer-default-export
export const getAllUsersService = async () => {
  const users = await User.findAll({
    attributes: {
      exclude: ['password', 'confirmEmailCode']
    }
  });
  return users;
};

/**
 * @method adminCreateUserService
 * - it persist a new admin user to the database
 * - sends new user a welcome email
 * - returns user data
 *
 * @param {Object} userDetails details of the user to be created
 *
 * @returns {Object} user object
 */

export const adminCreateUserService = async userDetails => {
  const { firstName, lastName, email, password, role } = userDetails;
  const sanitizedEmail = email.toLowerCase();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const confirmEmailCode = crypto.randomBytes(16).toString('hex');
  const result = await User.create({
    firstName,
    lastName,
    password: hashedPassword,
    email: sanitizedEmail,
    confirmEmailCode,
    roleType: role
  });

  const user = {
    firstName: result.firstName,
    lastName: result.lastName,
    email: result.email,
    img: result.image,
    pass: result.password,
    token: getToken(result)
  };

  sendWelcomeEmail(
    result.firstName,
    result.email,
    'Welcome Mail',
    'welcome-mail',
    result.confirmEmailCode
  );

  return { user };
};

/**
 * @method adminUpdateUserService
 * - admin update profile
 * - returns user data
 *
 * @param {Object} userId user Id of the user to be updated
 * @param {Object} userDetails details of the user to be created
 *
 * @returns {Object} user object */

export const adminUpdateUserService = async (userId, userDetails) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return user;
  }
  const updateUser = await user.update({
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    userName: userDetails.userName,
    email: userDetails.email,
    roleType: userDetails.roleType
  });

  const updatedUser = {
    firstName: updateUser.firstName,
    lastName: updateUser.lastName,
    userName: updateUser.userName,
    email: updateUser.email,
    roleType: updateUser.roleType
  };

  return updatedUser;
};

/**
 * @method adminDeleteUserService
 * - admin delete profile
 * - returns true or false
 *
 * @param {Object} userId user Id of the user to be deleted
 *
 * @returns {Object} user object */

export const adminDeleteUserService = async userId => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return user;
  }

  await user.destroy();
  const response = `user with email ${user.email} deleted successfully`;

  return response;
};

/**
 * @method followUserService
 * - follow user follow another user
 * - returns true or false
 *
 * @param {Object} userId user Id of the currently logged in user
 * @param {Object} friendUserId user Id of the user to be followed
 *
 * @returns {Object} user object */

export const followUserService = async (userId, friendUserId) => {
  // checks if there is an existing record in the table
  const checkIsFollowing = await Follow.findOne({
    where: { userId, friendUserId }
  });

  if (checkIsFollowing) {
    const { isFollowing } = checkIsFollowing;

    // update the isFollwing column with the opposite boolean
    await checkIsFollowing.update({
      isFollowing: !isFollowing
    });

    // if isFollowing is true, it's updated to false
    if (isFollowing) {
      return 'You have unfollowed this user';
    }

    // if isFollwing is false, it's updated to true
    return 'You have followed this user';
  }
  await Follow.create({
    userId,
    friendUserId
  });
  return 'You have followed this user';
};

/**
 * @method followUserService
 * - follow user follow another user
 * - returns true or false
 *
 * @param {Object} userId user Id of the currently logged in user
 * @param {Object} friendUserId user Id of the user to be followed
 *
 * @returns {Object} user object */

export const getUserFollowersService = async userId => {
  // checks if the user exist in the system
  const isUserExist = await User.findOne({ where: { id: userId } });
  if (!isUserExist) {
    const response = { message: 'Invalid request', status: 400 };
    throw response;
  }

  const followers = await Follow.findAll({
    where: { userId },
    attributes: ['id'],
    include: [
      {
        model: User,
        as: 'follower',
        attributes: ['firstName', 'lastName', 'email', 'userName', 'image']
      }
    ]
  });
  // checks if the user has no followers
  if (followers.length === 0) {
    return 'User has no follower';
  }

  return followers;
};
