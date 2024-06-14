// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model
const Product = require('../models/Product'); // Import Product model
const verify = require('../verifyToken');


// Route to render the owner dashboard view
router.get('/', async (req, res) => {
    try {
        // Fetch all products
        const products = await Product.find();
        res.render('ownerDashboard', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to add a new product
router.post('/add-product', async (req, res) => {
    try {
        const { name, description, price, category, imageURL } = req.body;
        const product = new Product({
            name,
            description,
            price,
            category,
            imageURL
        });
        await product.save();
        res.redirect('/owner-dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to delete a product
router.delete('/delete-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to update a product
router.put('/update-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, imageURL } = req.body;
        await Product.findByIdAndUpdate(id, { name, description, price, category, imageURL });
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

