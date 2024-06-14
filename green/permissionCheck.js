// verifyToken.js - Middleware for authentication and authorization

const jwt = require('jsonwebtoken');
const User = require('./models/User');
const dotenv = require('dotenv');

const { verifyToken } = require('./verifyToken');
const mongoose = require('mongoose');
dotenv.config();

module.exports = async function(req, res, next) {
    // Get the token from the request header or query parameter
    const token = req.header('auth-token') || req.query.token;
    if (!token) {
        return res.redirect('/login.html');
       
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        // Check if the user exists in the database
        
        req.user = decoded; // Store the decoded user data in the request object

        // Check if the user exists in the database
        const user = await User.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        // Check if the user has the 'owner' role
        if (user.role !== 'owner') {
            return res.status(403).json({ message: 'Unauthorized. Only owners have access.' });
        }

        // User has the 'owner' role, proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
