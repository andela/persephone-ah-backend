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

export default sendWelcomeEmail;
