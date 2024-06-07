const mongoose = require('mongoose');
const CONSTANTS = require('../utils/constants');
const User = require('./userModel');

const options = {
    timestamps: true
}

const flatAdminSchema = new mongoose.Schema({
    towerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tower',
        required: true
    },
    flatNumber: {
        type: String,
        required: true
    },
    flatOwnerName: {
        type: String,
        required: true
    },
    flatOwnerAadhar: {
        type: String,
        required: true
    },
    flatOwnerNumber: {
        type: String,
        required: true
    },
    isTenantPresent: {
        type: Boolean,
        required: true,
        default: false
    },
    tenantName: {
        type: String,
        required: function() { return this.isTenantPresent; }
    },
    tenantAadhar: {
        type: String,
        required: function() { return this.isTenantPresent; }
    },
    tenantNumber: {
        type: String,
        required: function() { return this.isTenantPresent; }
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

module.exports = User.discriminator(CONSTANTS.ROLES.FLAT_ADMIN, flatAdminSchema);
