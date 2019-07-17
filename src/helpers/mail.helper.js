import Mail from 'friendly-mail';
import dotenv from 'dotenv';

dotenv.config();
/**
 * @method sendWelcomeEmail
 * - it sends a welcome email to new users
 * - it implement mailstrap.io API to send email via friendly-mail
 * - returns a promise
 *
 * @param {String} recipientName user's first name object
 * @param {String} recipientMail user's email
 * @param {String} subject subject of mail
 * @param {String} type type of mail template to use via friendly-mail
 * @param {String} confirmCode email confirmation code
 *
 * @returns {Promise}
 */

const sendWelcomeEmail = (
  recipientName,
  recipientMail,
  subject,
  type,
  confirmCode
) => {
  return new Mail(type)
    .to(recipientMail)
    .subject(subject)
    .data({
      name: recipientName,
      url: `${process.env.url}/api/v1/users/verify/${confirmCode}`
    })
    .send();
};

/**
 * @method sendForgotPasswordMail
 * - it sends instruction on resetting password to user email address
 *
 * @param {String} recipientName user's first name object
 * @param {String} recipientMail user's email
 * @param {String} subject subject of mail
 * @param {String} type type of mail template to use via friendly-mail
 * @param {String} url with token embedded
 *
 * @returns {Promise}
 */

const sendForgotPasswordMail = async (
  recipientName,
  recipientMail,
  subject,
  type,
  url
) => {
  return new Mail(type)
    .to(recipientMail)
    .subject(subject)
    .data({
      name: recipientName,
      url
    })
    .send();
};

export default { sendWelcomeEmail, sendForgotPasswordMail };
