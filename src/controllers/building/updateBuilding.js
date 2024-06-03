const mongoose = require('mongoose');
const Building = require('../../models/buildingModel');
const User = require('../../models/userModel');
const { ROLES } = require('../../utils/constants');

exports.updateBuildingDetails = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { buildingId, name, constructionCompany, address, buildingContactNumber, officeAddress, officeContactNumber } = req.body;
        const { userId } = req.user;

        // Validate inputs
        if (!name || !constructionCompany || !address || !buildingContactNumber || !officeAddress ||!officeContactNumber) {
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
            return res.status(403).json({ message: 'Only globalAdmin is authorized to update building details' });
        }

        // Check if the Building exists
        const building = await Building.findById(buildingId).session(session);
        if (!building) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Building not found' });
        }

        // Update Building details
        building.name = name;
        building.constructionCompany = constructionCompany;
        building.address = address;
        building.buildingContactNumber = buildingContactNumber
        building.officeAddress = officeAddress 
        building.officeContactNumber = officeContactNumber

        await building.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Building details updated successfully', building });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: 'Building with this name and address already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};