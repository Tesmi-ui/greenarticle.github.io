// controllers/UserController.js
const User = require('../models/User');
const router = require('express').Router();
const checkowner = require('../middleware/checkowner');
const Product = require('../models/Product'); // Import User model
const verify = require('../verifyToken');


router.get('/', verify, checkowner , async (req, res) => {
    try {

        const products = await Product.find();
         res.send(products);    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/', verify, checkowner, async (req, res) => {
    try {
        // Create a new product
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        });

        // Save the product to the database
        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/:id', verify, checkowner, async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        // Update the product properties
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;

        // Save the updated product to the database
        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/:id', verify, checkowner, async (req, res) => {
    try {
        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        res.json(deletedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});