// profile.js

const express = require('express');
const router = express.Router();
const path = require('path');
const verify = require('../verifyToken');

const Product = require('../models/Product');
const Order = require('../models/Order');

// GET request to fetch user profile and serve index.html (protected by authentication middleware)
router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/post.html'));
    } catch (error) {
        console.error(error);
        res.redirect('/').json({ message: 'Failed to load user profile' });
    }
});



module.exports = router;
