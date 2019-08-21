import { getToken } from '../helpers/jwt.helper';
import model from '../db/models';
import { hashPassword } from '../services/auth.service';

const { User } = model;

const { frontendURL } = process.env;

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
      userName: username || names[0],
      password: hashedPassword,
      email: userEmail,
      socialAuth: provider,
      image: profileImage,
      passwordToken: true,
      confirmEmail: true,
      confirmEmailCode: null,
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
  try {
    if (request.user.noEmail) {
      response.redirect(`${frontendURL}/error`);
    }
    const token = await getToken(request.user);
    const { id, firstName, lastName, userName, email } = await request.user;
    response.redirect(
      `${frontendURL}/social?token=${token}&userid=${id}&firstname=${firstName}&lastname=${lastName}&username=${userName}&email=${email}`
    );
  } catch (error) {
    return error.message;
  }
};
export { socialCallback, socialRedirect };
