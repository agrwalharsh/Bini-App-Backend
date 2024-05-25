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
        type: String,
        required: true
    },
    numberOfFlats: {
        type: Number,
        required: true
    }
}, options);

module.exports = mongoose.model('Tower', towerSchema)