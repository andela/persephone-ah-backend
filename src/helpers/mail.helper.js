import Mail from 'friendly-mail';

const sendEmail = async (recipientName, recipientMail, subject) => {
  return await new Mail(subject)
    .to(recipientMail)
    .subject(subject)
    .data({ name: recipientName })
    .send();
};

export default sendEmail;
