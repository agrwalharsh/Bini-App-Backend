const mongoose = require('mongoose');
const CONSTANTS = require('../utils/constants');
const User = require('./userModel');

const options = {
    timestamps: true
}

const securitySchema = new mongoose.Schema({
    towerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tower',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, options);

module.exports = User.discriminator(CONSTANTS.ROLES.SECURITY, securitySchema);
