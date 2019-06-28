import Mail from 'friendly-mail';

const sendEmail = async (recipientName, recipientMail, subject) => {
  return await new Mail()
    .to(recipientMail, recipientName)
    .subject(subject)
    .data({ name: recipientName })
    .send();
};

sendEmail('Abass', 'afolabiabass62@gmail.com', 'Welcome Mail');

export default sendEmail;
