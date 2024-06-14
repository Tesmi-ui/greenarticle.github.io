// routes/formSubmitRoutes.js
const express = require('express');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
require('dotenv').config();

const router = express.Router();
router.get('/', (req, res) => {

    res.sendFile(__dirname + '/contact.html');

    
});

router.post('/smail', (req, res) => {
    const { name, email, message } = req.body;
    const welcomeId = uuid.v4();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: 'New message from contact form',
        text: `Welcome ID: ${welcomeId}\nName: ${name}\nEmail: ${email}\n\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.send('Email sent successfully');
        }
    });
});

module.exports = router;
