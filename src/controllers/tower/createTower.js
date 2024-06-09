const express = require('express');
const router = express.Router();
const Building = require('../../models/buildingModel');
const Tower = require('../../models/towerModel');
const User = require('../../models/userModel');
const { ROLES } = require('../../utils/constants');

exports.createTower = async (req, res) => {
    const { userId } = req.user
    const { buildingId, towerName, towerNumber, numberOfFlats } = req.body;

    try {

        if (!buildingId || !towerName || !towerNumber || !numberOfFlats) {
            return res.status(400).json({
                message: "All fields are mandatory"
            })
        }
        const user = await User.findById(userId)
        var buildingid = buildingId
        if (user.role == ROLES.BUILDING_ADMIN) {
            buildingid = user.building
        }
        const building = await Building.findById(buildingid).populate('towers').exec();

        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }

        // Check if tower with the same name already exists
        // const existingTower = building.towers.find(tower => tower.name === towerName);
        // if (existingTower) {
        //     return res.status(400).json({ message: `Tower with name '${towerName}' already exists in this building` });
        // }

        // Create new tower
        const newTower = new Tower({
            name: towerName,
            number: towerNumber,
            numberOfFlats: numberOfFlats,
            building: buildingid,
            createdBy: userId
        });

        await newTower.save();

        // Add tower to building
        building.towers.push(newTower._id);
        await building.save();

        res.status(200).json({ message: 'Tower added successfully', tower: newTower });
    } catch (error) {
        console.error('Error adding tower:', error);
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ message: `Tower with name '${towerName}' and number '${towerNumber}' already exists in this building` });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error.toString() });
        }
    }
}
