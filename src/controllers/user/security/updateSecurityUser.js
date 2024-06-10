const mongoose = require('mongoose');
const Security = require('../../../models/securityModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.updateSecurityUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { securityUserId, mobileNumber } = req.body;
        const { userId } = req.user;

        // Validate inputs
        if (!securityUserId || !mobileNumber) {
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
            return res.status(403).json({ message: 'Only building admin is authorized to update security users' });
        }

        // Check if the security user exists
        const securityUser = await Security.findById(securityUserId).session(session);
        if (!securityUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Security user not found' });
        }

        // Check if a security user with the same mobile number already exists
        const existingSecurityUser = await User.findOne({ mobileNumber, role: ROLES.SECURITY, _id: { $ne: securityUserId } }).session(session);
        if (existingSecurityUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Security user with this mobile number already exists' });
        }

        // Update security user details
        securityUser.mobileNumber = mobileNumber;

        securityUser.updatedBy = userId;

        await securityUser.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Security user updated successfully', securityUser });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error updating security user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
