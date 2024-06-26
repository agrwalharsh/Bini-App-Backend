const mongoose = require('mongoose');
const Building = require('../../../models/buildingModel');
const FlatAdmin = require('../../../models/flatAdminModel');
const Tower = require('../../../models/towerModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.getFlatAdminsByBuilding = async (req, res) => {
    const { userId } = req.user;

    try {
        // Retrieve user role and ensure the user is a building admin
        const user = await User.findById(userId)//.select('role').lean();
        if (!user || user.role !== ROLES.BUILDING_ADMIN) {
            return res.status(403).json({ message: 'Only building admins are authorized to perform this action' });
        }

        // Get building ID from the user model
        const buildingId = user.building;

        // Fetch the building by ID
        const building = await Building.findById(buildingId).populate('towers');
        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }

        console.log("building -> " + building)

        // Get all tower IDs for the building
        const towerIds = building.towers.map(tower => tower._id);
        console.log("tower ids -> " + towerIds)

        // Fetch all flat admins associated with the building's towers, and populate tower details
        const flatAdmins = await FlatAdmin.find({ towerId: { $in: towerIds } }).populate('towerId', 'name number');

        const response = flatAdmins.map(flatAdmin => ({
            _id: flatAdmin._id,
            towerId: flatAdmin.towerId._id,
            towerName: flatAdmin.towerId.name,
            towerNumber: flatAdmin.towerId.number,
            flatNumber: flatAdmin.flatNumber,
            flatOwnerName: flatAdmin.flatOwnerName,
            flatOwnerAadhar: flatAdmin.flatOwnerAadhar,
            flatOwnerNumber: flatAdmin.flatOwnerNumber,
            isTenantPresent: flatAdmin.isTenantPresent,
            tenantName: flatAdmin.tenantName,
            tenantAadhar: flatAdmin.tenantAadhar,
            tenantNumber: flatAdmin.tenantNumber,
            createdBy: flatAdmin.createdBy,
            updatedBy: flatAdmin.updatedBy,
            createdAt: flatAdmin.createdAt,
            updatedAt: flatAdmin.updatedAt
        }));

        res.status(200).json({ response });
    } catch (error) {
        console.error('Error fetching flat admins:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
