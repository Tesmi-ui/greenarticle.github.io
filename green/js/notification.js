const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
    },
});

const sendNotification = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL, 
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendNotification };
