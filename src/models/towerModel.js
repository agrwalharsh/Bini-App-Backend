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
    }
}, options);

module.exports = mongoose.model('Tower', towerSchema)