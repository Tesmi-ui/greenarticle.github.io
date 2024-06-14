const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to send contact email
async function sendContactEmail({ name, email, message }) {
    const ownerMailOptions = {
        from: process.env.EMAIL,
        to: process.env.OWNER_EMAIL,
        subject: 'New Contact Message',
        html: `<p>Name: ${name}</p>
               <p>Email: ${email}</p>
               <p>Message: ${message}</p>`,
    };

    const userMailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Thank you for contacting us',
        html: `<p>Hi ${name},</p>
               <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
               <p>Your message:</p>
               <p>${message}</p>`,
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(userMailOptions);
}

// Function to send order email
async function sendOrderEmail({ userId, productId, productName, quantity, total, shippingAddress, email }) {
    const ownerMailOptions = {
        from: process.env.EMAIL,
        to: process.env.OWNER_EMAIL,
        subject: 'New Order Received',
        html: `<p>User ID: ${userId}</p>
               <p>Product ID: ${productId}</p>
               <p>Product Name: ${productName}</p>
               <p>Quantity: ${quantity}</p>
               <p>Total: ${total}</p>
               <p>Shipping Address: ${shippingAddress}</p>`,
    };

    const userMailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Order Confirmation',
        html: `<p>Hi,</p>
               <p>Thank you for your order!</p>
               <p>Product Name: ${productName}</p>
               <p>Quantity: ${quantity}</p>
               <p>Total: ${total}</p>
               <p>Shipping Address: ${shippingAddress}</p>`,
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(userMailOptions);
}

module.exports = {
    sendContactEmail,
    sendOrderEmail,
};
