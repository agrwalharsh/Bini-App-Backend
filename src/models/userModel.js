const mongoose = require('mongoose');
const CONSTANTS = require('../utils/constants');

const options = {
    discriminatorKey: 'role',
    collection: 'users',
    timestamps: true
};

const userSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(CONSTANTS.ROLES),
        default: CONSTANTS.ROLES.RESIDENT
    },
    tempPassword: {
        type: String
    },
    tempPasswordExpiry: {
        type: Date
    },
    password: {
        type: String
    },
    ref: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role'
    }
}, options);

userSchema.index({ mobileNumber: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);