const mongoose = require('mongoose');
const User = require('./userModel');
const CONSTANTS = require('../utils/constants')

const options = {
    timestamps : true
}
const globalAdminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    }
}, options);

module.exports = User.discriminator(CONSTANTS.ROLES.GLOBAL_ADMIN, globalAdminSchema);