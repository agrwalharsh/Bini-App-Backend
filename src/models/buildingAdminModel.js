const mongoose = require('mongoose');
const CONSTANTS = require('../utils/constants');
const User = require('./userModel');

const options = {
    timestamps: true
}

const buildingAdminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true,
        unique: true
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, options);

module.exports = User.discriminator(CONSTANTS.ROLES.BUILDING_ADMIN, buildingAdminSchema);