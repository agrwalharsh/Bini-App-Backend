const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    durationInMonths: {
        type: Number,
        default: 12 // Default subscription duration in months (1 year)
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    metaData: [
        {
            type: String
        }
    ],
});

module.exports = mongoose.model('Subscription', subscriptionSchema);