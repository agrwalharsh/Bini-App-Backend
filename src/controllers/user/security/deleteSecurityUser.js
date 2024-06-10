const mongoose = require('mongoose');
const Security = require('../../../models/securityModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.deleteSecurityUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { securityUserId } = req.body;
        const { userId } = req.user;

        // Validate input
        if (!securityUserId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Security user ID must be provided' });
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
            return res.status(403).json({ message: 'Only building admin is authorized to delete security users' });
        }

        // Check if the security user exists
        const securityUser = await Security.findById(securityUserId).session(session);
        if (!securityUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Security user not found' });
        }

        // Delete security user
        await securityUser.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Security user deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error deleting security user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
