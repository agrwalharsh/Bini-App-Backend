const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['global admin', 'building admin'],
        default: 'building admin'
    }
});

module.exports = mongoose.model('User', userSchema);