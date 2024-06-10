const mongoose = require('mongoose');
const FlatResident = require('../../../models/flatAdminModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.deleteFlatResident = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { flatAdminId } = req.body;
        const { userId } = req.user;

        // Validate inputs
        if (!flatAdminId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Flat Resident must be provided' });
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
            return res.status(403).json({ message: 'Only building admin is authorized to delete flat residents' });
        }

        // Check if flat resident exists
        const flatResident = await FlatResident.findById(flatAdminId).session(session);
        if (!flatResident) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Flat resident not found' });
        }

        // Delete flat resident
        await FlatResident.deleteOne({ _id: flatAdminId }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Flat resident deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
