import Mail from 'friendly-mail';

export const sendWelcomeEmail = async (
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
      url: `http://localhost:3000/api/v1/users/verify/${confirmCode}`
    })
    .send();
};

export const sendForgotPasswordMail = async (
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
