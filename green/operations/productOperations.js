// productOperations.js
const Product = require('../models/Product');

async function createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
}

async function getProductById(productId) {
    return await Product.findById(productId);
}

async function updateProduct(productId, updateData) {
    return await Product.findByIdAndUpdate(productId, updateData, { new: true });
}

async function deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
}

async function getAllProducts() {
    return await Product.find();
}

module.exports = {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts
};
