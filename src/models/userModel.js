const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
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
        // required: true
    },
    role: {
        type: String,
        enum: Object.values(CONSTANTS.ROLES),
        default: CONSTANTS.ROLES.FLAT_ADMIN
    },
    tempPassword: {
        type: String
    },
    tempPasswordExpiry: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    ref: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role'
    },
    latestToken: {
        type: String,
        default: null
    },
    tokens: {
        type: [String],
        default: []
    },
    allowedMultipleDevices: {
        type: Boolean,
        default: false
    }
}, options);

userSchema.index({ mobileNumber: 1, role: 1 }, { unique: true });

userSchema.pre('save', function (next) {
    switch (this.role) {
        case CONSTANTS.ROLES.GLOBAL_ADMIN:
        case CONSTANTS.ROLES.BUILDING_ADMIN:
        case CONSTANTS.ROLES.FLAT_ADMIN:
            this.allowedMultipleDevices = true;
            break;
        case CONSTANTS.ROLES.SECURITY:
            this.allowedMultipleDevices = false;
            break;
        default:
            this.allowedMultipleDevices = false;
    }
    next();
});

// Method to generate a temporary password
userSchema.methods.generateTempPassword = async function () {
    const tempPassword = crypto.randomBytes(8).toString('hex'); // Generates a random temporary password
    this.tempPassword = await bcrypt.hash(tempPassword, 10); // Hash the temporary password
    this.tempPasswordExpiry = Date.now() + 24 * 60 * 60 * 1000; // Set the expiry time to 24 hours from now
    await this.save();
    return tempPassword;
};

// Method to reset the password using temporary password
userSchema.methods.resetPassword = async function (tempPassword, newPassword) {
    const isMatch = await bcrypt.compare(tempPassword, this.tempPassword);
    if (isMatch && this.tempPasswordExpiry > Date.now()) {
        this.password = await bcrypt.hash(newPassword, 10); // Hash the new password
        this.tempPassword = undefined; // Clear the temporary password
        this.tempPasswordExpiry = undefined; // Clear the temporary password expiry
        this.latestToken = null; 
        this.tokens = [];
        await this.save();
        return true;
    } else {
        throw new Error('Temporary password is invalid or expired');
    }
};

userSchema.methods.logout = function(token) {
    if (this.allowedMultipleDevices) {
        this.tokens = this.tokens.filter(t => t !== token);
    } else {
        this.latestToken = null;
    }
    return this.save();
};

module.exports = mongoose.model('User', userSchema);