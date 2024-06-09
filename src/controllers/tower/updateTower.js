const express = require('express');
const router = express.Router();
const Building = require('../../models/buildingModel');
const Tower = require('../../models/towerModel');
const User = require('../../models/userModel');
const { ROLES } = require('../../utils/constants');

exports.updateTower = async (req, res) => {
    const { userId } = req.user
    const { buildingId, towerId, towerName, towerNumber, numberOfFlats } = req.body;
    console.log("Building ID -> " + buildingId)

    try {

        if (!buildingId || !towerName || !towerNumber || !numberOfFlats || !towerId) {
            return res.status(400).json({
                message: "All fields are mandatory"
            })
        }

        const user = await User.findById(userId).select('role').lean();

        var buildingid = buildingId
        if (user.role == ROLES.BUILDING_ADMIN) {
            buildingid = user.building
        }

        const building = await Building.findById(buildingid).populate('towers').exec();
        console.log("Building -> " + building)

        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }

        // Find the tower by ID
        const towerToUpdate = await Tower.findById(towerId);
        if (!towerToUpdate) {
            return res.status(404).json({ message: 'Tower not found' });
        }

        // Update tower details
        towerToUpdate.name = towerName;
        towerToUpdate.number = towerNumber;
        towerToUpdate.numberOfFlats = numberOfFlats;
        towerToUpdate.updatedBy = userId;

        await towerToUpdate.save();

        res.status(200).json({ message: 'Tower updated successfully', tower: towerToUpdate });
    } catch (error) {
        console.error('Error updating tower:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
}
