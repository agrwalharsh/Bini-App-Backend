const mongoose = require('mongoose');
const Building = require('../../../models/buildingModel');
const User = require('../../../models/userModel');
const Security = require('../../../models/securityModel');
const { ROLES } = require('../../../utils/constants');

exports.getSecurityUsersByBuilding = async (req, res) => {
    const { userId } = req.user;

    try {
        // Retrieve the user and ensure they are a building admin
        const user = await User.findById(userId).select('role building').lean();
        if (!user || user.role !== ROLES.BUILDING_ADMIN) {
            return res.status(403).json({ message: 'Only building admins are authorized to perform this action' });
        }

        // Get the building ID from the user's data
        const buildingId = user.building;

        // Fetch the building by ID and populate its towers
        const building = await Building.findById(buildingId).populate('towers').lean();
        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }

        // Get all tower IDs for the building
        const towerIds = building.towers.map(tower => tower._id);

        console.log("tower Ids -> " +towerIds)

        // Fetch all security users associated with the building's towers
        // const securityUsers = await User.find({
        //     role: ROLES.SECURITY,
        //     'security.towerId': { $in: towerIds }
        // }).populate('security.towerId', 'name number').lean();

        // console.log("Security Users -> " + securityUsers)

        const securityUsers = await Security.find({
            role: ROLES.SECURITY,
            towerId: { $in: towerIds }
        }).populate('towerId', 'name number').lean();

        console.log("Security Users -> ", securityUsers);

        // Format the response to include tower details
        const formattedSecurityUsers = securityUsers.map(user => {
            const { security, ...userData } = user;
            return {
                ...userData,
                // towerId: security.towerId._id,
                // towerName: security.towerId.name,
                // towerNumber: security.towerId.number,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        });

        res.status(200).json({ securityUsers: formattedSecurityUsers });
    } catch (error) {
        console.error('Error fetching security users:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
