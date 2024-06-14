const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


// Register
router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);   

    if (error) return res.status(400).json({error : error.details[0].message});

    // Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json({error: 'Email already exists'});

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role:'user'
    });
    try {
        await user.save();
        res.json({ message: 'User registered successfully!'});
    } catch (err) {
        res.status(400).json({error: err.message });
    }
});

//login currently this surving for both user and owner for securty pur[ose it can] do
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email is not found');

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');
        // Create and assign a token
        let dashboardRoute;
        let token;
        if (user.role === 'owner') {
            dashboardRoute = 'add-product-form.html';
            token = jwt.sign({_id : user._id, role: user.role} , process.env.TOKEN_SECRET,{ expiresIn: '2h'});
        } else {
            dashboardRoute = 'userDashboard.html';
            token = jwt.sign({_id : user._id, role: user.role}, process.env.USER_SECRET,{expiresIn: '2h'});
            
        }
        // res.header('auth-token', token).send(token);
       
        res.json({ token, dashboardRoute});
        console.log('successfully logged In ! token sent');


    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

/*

//login currently this surving for both user and owner for securty pur[ose it can] do
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email is not found');

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');
        // Create and assign a token
        let dashboardRoute;
        if (user.role === 'owner') {
            dashboardRoute = 'add-product-form.html';
        } else {
            dashboardRoute = 'userDashboard.html';
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        // res.header('auth-token', token).send(token);
       
        res.json({ token, dashboardRoute});
        console.log('successfully logged In ! token sent');


    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});  */

module.exports = router;