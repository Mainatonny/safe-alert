require('dotenv').config();
const nodemailer = require('nodemailer');

// Configure the email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Function to send notifications
const sendNotifications = async (contacts, emergencyDetails) => {
  const emailPromises = contacts.map(contact => {
    const mailOptions = {
      from: process.env.EMAIL_USER,  // use environment variable for email
      to: contact,
      subject: 'Emergency Alert',
      text: `Emergency Alert: ${emergencyDetails}`,
    };

    return transporter.sendMail(mailOptions)
      .catch(error => {
        console.error(`Error sending email to ${contact}:`, error);
        // Continue with the next email even if one fails
      });
  });

  
};

module.exports = { sendNotifications };