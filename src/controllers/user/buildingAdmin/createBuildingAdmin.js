const mongoose = require('mongoose');
const BuildingAdmin = require('../../../models/buildingAdminModel');
const Building = require('../../../models/buildingModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.createBuildingAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { adminName, aadhar, mobileNumber, buildingId } = req.body;
        const { userId } = req.user;

        // Validate inputs
        if (!adminName || !aadhar || !mobileNumber || !buildingId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Retrieve user from the database with only the necessary fields
        const user = await User.findById(userId).select('role').lean();

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        // Check if the user has the required role (globalAdmin)
        if (user.role !== ROLES.GLOBAL_ADMIN) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Only globalAdmin is authorized to create building admins' });
        }

        // Check if building exists
        const building = await Building.findById(buildingId).session(session);
        if (!building) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Building not found' });
        }

        // Check the maxNoOfAdmins constraint
        const currentAdminCount = await BuildingAdmin.countDocuments({ building: buildingId }).session(session);
        if (building.maxNoOfAdmins && currentAdminCount >= building.maxNoOfAdmins) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Maximum number of building admins reached' });
        }

        // Check if an admin with the same mobile number is already registered for this building
        const existingAdmin = await BuildingAdmin.findOne({ mobileNumber, building: buildingId }).session(session);
        if (existingAdmin) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Admin with this mobile number is already registered for this building' });
        }

        const buildingAdmin = new BuildingAdmin({
            mobileNumber: mobileNumber,
            role: ROLES.BUILDING_ADMIN,
            adminName: adminName,
            aadhar: aadhar,
            building: buildingId,
            createdBy: userId
        });

        await buildingAdmin.save({ session });

        // Add the new admin to the building's buildingAdmins array
        building.buildingAdmins.push(buildingAdmin._id);
        await building.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Building admin created successfully', buildingAdmin });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: 'Aadhar or mobile number already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
