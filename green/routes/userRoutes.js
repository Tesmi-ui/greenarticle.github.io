// routes/userRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const verify = require('../verifyToken');
const User = require('../models/User'); // Assuming you have a User model
//const check = require('../permissionCheck');
const mongoOperations = require('../operations/mongoOperations');


//router.use(check);


//new authentication trying only for users

const authenticateToken = (req, res, next) => {
    const token = req.headers['auth-token'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.USER_key, (err, user) => {
        if (err) return res.sendStatus(403);
        req.userId = user._id;
        next();
    });
};



// Get all users
router.get('/',  async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a specific user by userId
router.get('/:userId', async (req, res) => {
    try{
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message:'User not found'});
        }
        res.json(user);

    } catch (error) {
        console.error('Error Fetching User',error);
        res.status(500).json({message:"internal server Error"});
    }
});
// Create a new user
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        if (!name || !email || !phone || !address) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = new User({
            name,
            email,
            phone,
            address
        });
        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




// Update user details with change count limit
router.post('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        if (user.lastChangeDate) {
            const lastChangeYear = user.lastChangeDate.getFullYear();
            if (lastChangeYear < currentYear) {
                user.changeCount = 0; // Reset change count if a new year
            }
        }

        if (user.changeCount >= 5) {
            return res.status(403).json({ message: 'You can only change your details 5 times per year.' });
        }

        // Update user details
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;

        user.changeCount += 1;
        user.lastChangeDate = currentDate;

        await user.save();

        res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Fetch user details
router.get('/me', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a user
router.put('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Delete a user
router.delete('/:userId', async (req, res) => {
    try {
        // Find the user by userId and delete it
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
            }
            res.json(deletedUser);
    } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
    }
});
//check




router.get('/:identifier', async (req, res) => {
    try {
        const identifier = req.params.identifier;
        
        // Check if the identifier is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            const userById = await User.findById(identifier);
            if (userById) {
                return res.json(userById);
            }
        }
        
        // If the identifier is not a valid ObjectId, search by email
        const userByEmail = await User.findOne({ email: identifier });
        if (userByEmail) {
            return res.json({ id: userByEmail._id, user: userByEmail });
        }

        // If no user is found by either ID or email, return a 404 status
        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a user by email
router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Example route to get orders by email
router.get('/orders/by-email/:email', async (req, res) => {
    try {
        const orders = await mongoOperations.findOrdersByEmail(req.params.email);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Example route to update order status
router.put('/order/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const order = await mongoOperations.updateOrderStatus(req.params.id, status);
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Route to find a user by ID
router.get('/by-id/:id', async (req, res) => {
    try {
        const user = await mongoOperations.findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to find a user by email
router.get('/by-email/:email', async (req, res) => {
    try {
        const user = await mongoOperations.findUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to get orders by user ID
router.get('/orders/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const orders = await findOrdersByUserId(userId);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders by user ID:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;





