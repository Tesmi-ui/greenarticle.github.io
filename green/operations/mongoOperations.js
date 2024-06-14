const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/User');  // Adjust the path to your User model
const Order = require('../models/Order');  // Adjust the path to your Order model

// Ensure Mongoose connection
if (!mongoose.connection.readyState) {
    // Add your MongoDB URI here
    const mongoURI = 'mongodb://localhost:27017/greenarticles';
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}


// 1. Finding User Information by User ID
async function findUserById(userId) {
    try {
        return await User.findById(userId);
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw new Error('User not found');
    }
}

// 2. Updating Order Status
async function updateOrderStatus(orderId, newStatus) {
    try {
        return await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
    } catch (error) {
        console.error('Error updating order status:', error);
        throw new Error('Order status update failed');
    }
}

// 3. Finding Orders by Different Criteria
async function findOrdersByProductName(productName) {
    try {
        return await Order.find({ productName: productName });
    } catch (error) {
        console.error('Error finding orders by product name:', error);
        throw new Error('Orders not found');
    }
}

async function findOrderById(orderId) {
    try {
        return await Order.findById(orderId);
    } catch (error) {
        console.error('Error finding order by ID:', error);
        throw new Error('Order not found');
    }
}

async function findOrdersByUserId(userId) {
    try {
        return await Order.find({ userId: userId });
    } catch (error) {
        console.error('Error finding orders by user ID:', error);
        throw new Error('Orders not found');
    }
}

// 4. Interacting with Dates
async function findLatestOrder() {
    try {
        return await Order.find().sort({ createdAt: -1 }).limit(1);
    } catch (error) {
        console.error('Error finding latest order:', error);
        throw new Error('Latest order not found');
    }
}

async function findOrdersByDateRange(startDate, endDate) {
    try {
        return await Order.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });
    } catch (error) {
        console.error('Error finding orders by date range:', error);
        throw new Error('Orders not found');
    }
}

// 5. Finding Orders by User's Name
async function findOrdersByUserName(userName) {
    try {
        const user = await User.findOne({ name: userName });

        if (user) {
            return await Order.find({ userId: user._id });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error finding orders by user name:', error);
        throw new Error('Orders not found');
    }
}

// 6. Finding Orders by Email
async function findOrdersByEmail(userEmail) {
    try {
        const user = await User.findOne({ email: userEmail });

        if (user) {
            return await Order.find({ userId: user._id });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error finding orders by email:', error);
        throw new Error('Orders not found');
    }
}



module.exports = {
    findUserById,
    updateOrderStatus,
    findOrdersByProductName,
    findOrderById,
    findOrdersByUserId,
    findLatestOrder,
    findOrdersByDateRange,
    findOrdersByUserName,
    findOrdersByEmail,
};
