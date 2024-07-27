const mongoose = require('mongoose');
const Security = require('../../../models/securityModel');
const Tower = require('../../../models/towerModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.createSecurityUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { buildingId, towerId, mobileNumber } = req.body;
        const { userId } = req.user;

        // Validate inputs
        if (!mobileNumber || (!towerId && !buildingId)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Retrieve user from the database with only the necessary fields
        const user = await User.findById(userId).select('role').lean();
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        // Check if the user has the required role (buildingAdmin)
        if (user.role !== ROLES.BUILDING_ADMIN) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Only building admin is authorized to create security users' });
        }

        let actualBuildingId = buildingId;
        let actualTowerId = towerId;

        if (towerId) {
            // Check if tower exists and get the building ID from the tower details
            const tower = await Tower.findById(towerId).session(session);
            if (!tower) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Tower not found' });
            }
            actualBuildingId = tower.building;
            actualTowerId = tower._id;
        }

        // Check if tower exists
        // const tower = await Tower.findById(towerId).session(session);
        // if (!tower) {
        //     await session.abortTransaction();
        //     session.endSession();
        //     return res.status(404).json({ message: 'Tower not found' });
        // }

        // Check if a security user with the same mobile number already exists
        const existingSecurityUser = await User.findOne({ mobileNumber, role: ROLES.SECURITY }).session(session);
        if (existingSecurityUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Security user with this mobile number already exists' });
        }

        const securityUser = new Security({
            mobileNumber,
            role: ROLES.SECURITY,
            building: actualBuildingId,
            towerId: actualTowerId,
            createdBy: userId
        });

        await securityUser.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Security user created successfully', securityUser });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: 'Mobile number already exists' });
        }
        console.error('Error creating security user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
