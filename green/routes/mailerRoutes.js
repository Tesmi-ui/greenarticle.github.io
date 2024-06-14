const express = require('express');
const router = express.Router();

const Contact = require('../models/contact');
const Order = require('../models/Order');

const { sendContactEmail, sendOrderEmail } = require('../mailer/mailer');


// Route to handle contact form submissions
router.post('/send-contact-email', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        await sendContactEmail({ name, email, message });
        res.status(200).send('Contact email sent successfully');
    } catch (error) {
        res.status(500).send('Failed to send contact email');
    }
});

// Route to handle order form submissions
router.post('/send-order-email', async (req, res) => {
    const { userId, productId, productName, quantity, total, shippingAddress, email } = req.body;

    try {
        const newOrder = new Order({ userId, productId, productName, quantity, total, shippingAddress });
        await newOrder.save();
        await sendOrderEmail({ userId, productId, productName, quantity, total, shippingAddress, email });
        res.status(200).send('Order placed successfully');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Failed to place order');
    }
});

module.exports = router;


