const express = require('express');
const router = express.Router();
const Building = require('../../models/buildingModel');
const Tower = require('../../models/towerModel');

exports.createTower = async (req, res) => {
    const { buildingId, towerName, towerNumber, numberOfFlats } = req.body;

    try {
        const building = await Building.findById(buildingId).populate('towers').exec();

        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }

        // Check if tower with the same name already exists
        const existingTower = building.towers.find(tower => tower.name === towerName);
        if (existingTower) {
            return res.status(400).json({ message: `Tower with name '${towerName}' already exists in this building` });
        }

        // Create new tower
        const newTower = new Tower({
            name: towerName,
            number: towerNumber,
            numberOfFlats: numberOfFlats,
            building: buildingId
        });

        await newTower.save();

        // Add tower to building
        building.towers.push(newTower._id);
        await building.save();

        res.status(200).json({ message: 'Tower added successfully', tower: newTower });
    } catch (error) {
        console.error('Error adding tower:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
}
