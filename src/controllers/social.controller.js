import { getToken } from '../helpers/jwt.helper';
import model from '../db/models';
import Helper from '../services/helper';
import { hashPassword } from '../services/auth.service';

const { User } = model;

/**
 * @description returns tokens and profile from social service
 *
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {object} profile
 * @param {function} done
 *
 * @returns {object} User Profile Object
 */

const socialCallback = async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails, provider, photos, username } = profile;
  if (!emails) {
    const userWithNoEmail = { noEmail: true };
    return done(null, userWithNoEmail);
  }
  const userEmail = emails[0].value;
  const names = displayName ? displayName.split(' ') : ['', ''];
  const hashedPassword = await hashPassword(id);
  const profileImage = photos[0].value;
  const [user] = await User.findOrCreate({
    where: { email: userEmail },
    defaults: {
      firstName: names[0] || `${provider}Firstname`,
      lastName: names[1] || `${provider}Lastname`,
      password: hashedPassword,
      email: userEmail,
      socialAuth: provider,
      image: profileImage,
      confirmEmail: true,
      twitterHandle: username ? `@${username}` : null
    }
  });
  return done(null, user.dataValues);
};

/**
 * @description returns a unique token for a verified user
 *
 * @param {object} request
 * @param {string} response
 *
 * @returns {object} User token
 */

const socialRedirect = async (request, response) => {
  if (request.user.noEmail) {
    return Helper.failResponse(response, 400, {
      message: 'user has no email address'
    });
  }

  const token = await getToken(request.user);
  return Helper.successResponse(response, 200, token);
};
export { socialCallback, socialRedirect };
