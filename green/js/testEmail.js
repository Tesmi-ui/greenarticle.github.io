const { sendNotification } = require('../js/notification');

sendNotification('recipient@example.com', 'Test Subject', 'Test Email Body')
    .then(() => {
        console.log('Email sent successfully');
    })
    .catch((error) => {
        console.error('Error sending email:', error);
    });
