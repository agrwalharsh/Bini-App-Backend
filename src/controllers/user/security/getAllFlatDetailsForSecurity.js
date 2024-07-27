const mongoose = require('mongoose');
const Building = require('../../../models/buildingModel');
const FlatAdmin = require('../../../models/flatAdminModel');
const Tower = require('../../../models/towerModel');
const Security = require('../../../models/securityModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.getAllFlatDetailsForSecurity = async (req, res) => {
    const { userId } = req.user;

    try {
        // Retrieve user role and ensure the user is a security admin
        const user = await User.findById(userId);
        if (!user || user.role !== ROLES.SECURITY) {
            return res.status(403).json({ message: 'Only security admins are authorized to perform this action' });
        }

        // Populate the referenced document to get the security user's details including the building
        const securityUser = await User.findOne({ _id: userId, role: ROLES.SECURITY })
            .populate('ref')
            .exec();

        console.log(securityUser)

        if (!securityUser) {
            throw new Error('User not found or user is not a security admin');
        }

        // Get the building ID from the security user's reference
        const buildingId = securityUser.building;

        // Fetch all towers associated with the building
        const towers = await Tower.find({ building: buildingId });

        // Get all tower IDs
        const towerIds = towers.map(tower => tower._id);

        // Fetch all flat admins associated with the building's towers, and populate tower details
        const flatAdmins = await FlatAdmin.find({ towerId: { $in: towerIds } }).populate('towerId', 'name number');

        // Prepare the response
        const response = flatAdmins.map(flatAdmin => ({
            _id: flatAdmin._id,
            towerId: flatAdmin.towerId._id,
            towerName: flatAdmin.towerId.name,
            towerNumber: flatAdmin.towerId.number,
            flatNumber: flatAdmin.flatNumber,
            // Uncomment the following lines if you need these details
            // flatOwnerName: flatAdmin.flatOwnerName,
            // flatOwnerAadhar: flatAdmin.flatOwnerAadhar,
            // flatOwnerNumber: flatAdmin.flatOwnerNumber,
            // isTenantPresent: flatAdmin.isTenantPresent,
            // tenantName: flatAdmin.tenantName,
            // tenantAadhar: flatAdmin.tenantAadhar,
            // tenantNumber: flatAdmin.tenantNumber,
            // createdBy: flatAdmin.createdBy,
            // updatedBy: flatAdmin.updatedBy,
            // createdAt: flatAdmin.createdAt,
            // updatedAt: flatAdmin.updatedAt
        }));

        res.status(200).json({ response });
    } catch (error) {
        console.error('Error fetching flat admins:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
