const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Indoor Plant', 'Outdoor Plant', 'Indoor Pot', 'Outdoor Pot', 'Indoor Combo', 'Outdoor Combo'],
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
