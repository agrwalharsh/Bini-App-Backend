const express = require('express');
const Building = require('../../models/buildingModel');
const User = require('../../models/userModel');
const { ROLES } = require('../../utils/constants');

exports.getAllBuildingsAndAdmin = async (req, res) => {
    try {
        // Fetch all buildings
        const buildings = await Building.find().lean();

        if (!buildings || buildings.length === 0) {
            return res.status(404).json({ message: 'No buildings found' });
        }

        // For each building, fetch the related building admins from the User model
        const buildingsWithAdmins = await Promise.all(
            buildings.map(async (building) => {
                const admins = await User.find({
                    _id: { $in: building.buildingAdmins },
                    role: ROLES.BUILDING_ADMIN
                }).select('name aadhar mobileNumber').lean();

                return {
                    ...building,
                    buildingAdmins: admins
                };
            })
        );

        return res.status(200).json(buildingsWithAdmins);
    } catch (error) {
        console.error('Error fetching buildings with admins:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};