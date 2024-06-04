const mongoose = require('mongoose');
const subscriptionSchema = require('./subscriptionModel');

const options = {
    timestamps: true
}

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
    buildingContactNumber: {
        type: String,
        required: true
    },
    officeAddress: {
        type: String,
        required: true
    },
    officeContactNumber: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buildingAdmins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuildingAdmin'
    }],
    currentSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    subscriptionHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    }],
    towers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tower'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    maxNoOfAdmins: {
        type: Number,
        default: 1
    }
}, options);

// Method to check if the current subscription is valid
buildingSchema.methods.isSubscriptionValid = async function () {
    console.log("isSubscriptionValid function invoked")
    try {
        const currentDate = new Date();
        console.log("current date -> " + currentDate)
        const subscription = await mongoose.model('Subscription').findById(this.currentSubscription);
        console.log("current subsciption date -> " + subscription)
        if (!subscription) {
            return false; // No subscription found
        }
        console.log("End date -> " + subscription.endDate)

        return subscription.endDate > currentDate;
    } catch (error) {
        console.error('Error checking subscription validity:', error);
        return false; // Handle error gracefully and return false
    }
};

buildingSchema.index({ name: 1, address: 1 }, { unique: true });

module.exports = mongoose.model('Building', buildingSchema);
