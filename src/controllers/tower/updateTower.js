const express = require('express');
const router = express.Router();
const Building = require('../../models/buildingModel');
const Tower = require('../../models/towerModel');
const User = require('../../models/userModel');
const { ROLES } = require('../../utils/constants');

exports.updateTower = async (req, res) => {
    const { userId } = req.user
    // const { buildingId, towerId, towerName, towerNumber, numberOfFlats } = req.body;
    const { towerId, towerName, towerNumber, numberOfFlats } = req.body;

    try {

        if (!towerName || !towerNumber || !numberOfFlats || !towerId) {
            return res.status(400).json({
                message: "All fields are mandatory"
            })
        }

        const user = await User.findById(userId).lean();

        console.log(user)

        if (user.role != ROLES.BUILDING_ADMIN) {
            return res.status(403).json({
                message: "Only building admin can update tower"
            })
        }
        var buildingId = user.building

        console.log(buildingId)

        const building = await Building.findById(buildingId).populate('towers').exec();
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
