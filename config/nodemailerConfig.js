const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'antonymaina5956@gmail.com',
    pass: '59585956@Tonny',
  },
});

module.exports = transporter;
