import sendgrid from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sendgrid.setApiKey(process.env.SENDGRID_API);
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

export const sendWelcomeEmail = (
  recipientName,
  recipientMail,
  subject,
  type,
  confirmCode
) => {
  return sendgrid.send({
    to: recipientMail,
    subject,
    from: 'persephone@andela.com',
    html: `Hi ${recipientName}. Welcome To Author's Haven.

Please click on this  <a href="${process.env.FRONTEND_URL}/verify?token=${confirmCode}" >link</a> to confirm your email.`
  });
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

export const sendForgotPasswordMail = async (
  recipientName,
  recipientMail,
  subject,
  type,
  url
) => {
  return sendgrid.send({
    to: recipientMail,
    subject,
    from: 'persephone@andela.com',
    html: `Hi ${recipientName}. You requested to reset your author's haven account's password.

Please click on this  <a href="${url}" >link</a> to reset your password.`
  });
};

/**
 * @method sendBlockedArticle
 * - it sends a mail to the user that their article has been taken down.
 *
 * @param {String} recipientName user's name object
 * @param {String} recipientMail user's email
 * @param {String} subject subject of mail
 * @param {String} type type of mail template to use via friendly-mail
 * @param {String} url with token embedded
 *
 * @returns {Promise}
 */

export const sendBlockedArticle = async (
  recipientName,
  recipientMail,
  subject,
  type,
  articleTitle
) => {
  return sendgrid.send({
    to: recipientMail,
    subject,
    from: 'persephone@andela.com',
    html: `Hi ${recipientName}. This letter is to notify you concerning the article you published titled <strong>${articleTitle}</strong>.
The above article has been reported by different users and after several investigations, we decided to take the article
down.
The above article has violated the rules and regulations of the Author's Haven Platform.

Thank you for your kind attention to the above matter. Please feel free to contact us at any time: authorhaven@mail.com.

Author's Haven.`
  });
};
