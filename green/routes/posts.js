

const router = require('express').Router();
const path = require('path');

const Product = require('../models/Product'); // Import User model
const verify = require('../verifyToken');
const User = require('../models/User');
const Order = require('../models/Order');
const check = require('../permissionCheck');



router.get('/', verify, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/post.html'));
    } catch (error) {
        console.error(error);
        res.redirect('/').json({ message: 'Failed to load user profile' });
    }
    
});
router.get('/add-product-form.html', verify, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/add-product-form.html'));
    } catch (error) {
        console.error(error);
        res.redirect('/').json({ message: 'faild to load product data' });
    }
});





module.exports = router;
