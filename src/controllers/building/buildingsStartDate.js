const express = require('express');
const router = express.Router();
const Building = require('../../models/buildingModel');

exports.getBuildingsListWithStartDate = async (req, res) => {
    try {
        const buildings = await Building.find()
            .populate('createdBy', 'name contactNumber') // Populate admin details
            .populate({
                path: 'currentSubscription',
                select: 'startDate' // Select start date from current subscription
            })
            .exec();

        if (!buildings || buildings.length === 0) {
            return res.status(404).json({ message: 'No buildings found' });
        }

        const buildingsList = buildings.map(building => {
            const { _id, name, constructionCompany, address, createdBy, currentSubscription } = building;
            let startDate = null;
            if (currentSubscription && currentSubscription.startDate) {
                startDate = currentSubscription.startDate;
            }

            return {
                buildingId: _id,
                name,
                constructionCompany,
                address,
                adminId: createdBy._id,
                adminName: createdBy.name,
                adminContactNumber: createdBy.contactNumber,
                startDate // Include start date if present
            };
        });

        res.status(200).json({buildingsList});
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}