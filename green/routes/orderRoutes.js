const express = require('express');
const router = express.Router();
const verify = require('../verifyToken');
const Order = require('../models/Order'); // Import the Order model
const Product = require('../models/Product'); 
const { findOrdersByUserId } = require('../operations/mongoOperations');
// Error Handling Middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Get all orders (assuming authenticated users)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

// Get orders for a specific user
router.get('user/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.findOrdersByUserId({ userId: userId });
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

// Get a specific order by ID
router.get('/:orderId', async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
});

// Create a new order
router.post('/', async (req, res, next) => {
    try {
        // Assuming order details are provided in the request body
        const { userId, productId, quantity, shippingAddress, total, productName } = req.body;

        // Check if all required fields are provided
        if (!userId || !productId || !quantity || !shippingAddress || !total || !productName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new order
        const order = new Order({
            userId,
            productId,
            quantity,
            shippingAddress,
            total,
            productName
        });

        // Save the order to the database
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        next(error);
    }
});

// Update an existing order
router.put('/:orderId', verify, async (req, res, next) => {
    try {
        // Find the order by ID and update it
        const orderId = req.params.orderId;
        const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
});

// Delete an order
router.delete('/:orderId', verify, async (req, res, next) => {
    try {
        // Find the order by ID and delete it
        const orderId = req.params.orderId;
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(deletedOrder);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
