const mongoose = require('mongoose');

const options = {
    timestamps: true
}
const towerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    numberOfFlats: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, options);

towerSchema.index({ name: 1, number: 1, building: 1 }, { unique: true });

module.exports = mongoose.model('Tower', towerSchema)