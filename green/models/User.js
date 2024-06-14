//models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    phone:{
        type: String,
        max:10,
    },
    address:{
        type: String,
    },
    changeCount: {
        type: Number,
        default: 0

    },
    lastChangeDate: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['user', 'owner'],
        default: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);