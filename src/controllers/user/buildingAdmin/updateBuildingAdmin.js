const mongoose = require('mongoose');
const BuildingAdmin = require('../../../models/buildingAdminModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.updateBuildingAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { adminId, adminName, aadhar, mobileNumber } = req.body;
        const { userId } = req.user;

        // Validate inputs
        if (!adminName || !aadhar || !mobileNumber || !adminId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Invalid inputs' });
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
            return res.status(403).json({ message: 'Only globalAdmin is authorized to update building admins' });
        }

        // Check if the Building Admin exists
        const buildingAdmin = await BuildingAdmin.findById(adminId).session(session);
        if (!buildingAdmin) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Building admin not found' });
        }

        // Update Building Admin details
        buildingAdmin.adminName = adminName;
        buildingAdmin.aadhar = aadhar;
        buildingAdmin.mobileNumber = mobileNumber;

        await buildingAdmin.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Building admin updated successfully', buildingAdmin });
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
