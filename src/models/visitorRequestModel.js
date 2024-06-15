const mongoose = require('mongoose');

const options = {
    timestamps: true
}

const visitorRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    flatUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'flatAdmin',
        required: true
    },
    security: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'security',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    }
}, options);

module.exports = mongoose.model('visitorRequest', visitorRequestSchema);