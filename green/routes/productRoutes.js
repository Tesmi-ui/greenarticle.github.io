// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer for file upload
const upload = multer({ dest: 'uploads/' }); // Set upload destination
const verify = require('../verifyToken');
const Product = require('../models/Product');
const mongoOperations = require('../operations/mongoOperations');




// GET request to retrieve all products
router.get('/ownerDashboard', verify, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/userDashboard', async (req, res) => {
  try {
      let products;
      const query = req.query.q ? req.query.q.trim() : '';

      if (query) {
          // If search query is provided, filter products based on name or category
          products = await Product.find({
              $or: [
                  { name: { $regex: query, $options: 'i' } }, // Match name
                  { category: { $regex: query, $options: 'i' } } // Match category
              ]
          });
      } else {
          // If no search query provided, fetch all products
          products = await Product.find();
      }

      res.json(products);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal server error');
  }
});

// GET request to retrieve a specific product by ID
router.get('/:productId',  async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // PUT request to update a product by ID
  router.put('/:productId', verify, async (req, res) => {
    try {
      const productId = req.params.productId;
      const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // DELETE request to delete a product by ID
  router.delete('/:productId', verify, async (req, res) => {
    try {
      const productId = req.params.productId;
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
// POST request to create a new product
router.post('/', upload.single('image'), verify, async (req, res) => {
    try {
        // Check if file upload exists
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
        const { name, price, description, category, stockQuantity } = req.body;
        const image = req.file.filename;
        
        const newProduct = new Product({
            name,
            price,
            imageURL:image,
            description,
            category,
            stockQuantity
        });

        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/orders/by-product/:productName', async (req, res) => {
  try {
      const orders = await mongoOperations.findOrdersByProductName(req.params.productName);
      res.json(orders);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});




module.exports = router;