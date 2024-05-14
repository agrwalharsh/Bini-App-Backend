const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    name: String,
    constructionCompany: String,
    address: String,
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Building', buildingSchema);