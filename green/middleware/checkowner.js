const users = required('../models/Users');
const products = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware function to check ownership
function checkOwnership(req, res, next) {
    // Assuming you have some way to determine ownership, like a user role or ownership flag
    const isOwner = req.user && req.user.role === 'owner'; // Example check, replace with your own logic

    if (isOwner) {
        // Redirect owner to specific dashboard
        return res.redirect('/owner-dashboard');
    } else {
        // Redirect non-owner to user dashboard
        return res.redirect('/user-dashboard');
    }
}

// Apply middleware to routes where ownership check is required
app.get('/dashboard', checkOwnership, (req, res) => {
    // This route will redirect to the appropriate dashboard based on ownership
    // You can render a different view or perform additional actions based on ownership
    // For example, if user is not the owner, you might render a regular user dashboard
});
