const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    constructionCompany: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buildingAdmins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuildingAdmin'
    }]
});

buildingSchema.index({ name: 1, address: 1 }, { unique: true });

module.exports = mongoose.model('Building', buildingSchema);
