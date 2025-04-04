const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lcoalvibe.noreply@gmail.com', 
    pass: 'it doesnot work. google block me I hate it'          
  }
});


const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: '"LocalVibe Hub" <lcoalvibe.noreply@gmail.com>',
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
