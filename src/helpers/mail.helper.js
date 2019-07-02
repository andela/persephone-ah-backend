import Mail from 'friendly-mail';
import dotenv from 'dotenv';

dotenv.config();
/**
 *
 *
 * @param {string} recipientName
 * @param {string} recipientMail
 * @param {string} subject
 * @param {string} type
 * @param {string} confirmCode
 * @returns
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
