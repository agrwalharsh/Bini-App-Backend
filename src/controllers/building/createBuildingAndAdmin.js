const mongoose = require('mongoose');
const BuildingAdmin = require('../../models/buildingAdminModel');
const Building = require('../../models/buildingModel');
const User = require('../../models/userModel');
const { ROLES } = require('../../utils/constants');

exports.createBuildingAndAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, constructionCompany, address, city, country, pinCode, buildingContactNumber, officeAddress, officeContactNumber, adminName, aadhar, mobileNumber } = req.body;

        // Validate inputs
        if (!name || !constructionCompany || !address || !city || !country || !pinCode || !buildingContactNumber || !officeAddress || !officeContactNumber || !adminName || !aadhar || !mobileNumber) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if building with the same name and address already exists
        const existingBuilding = await Building.findOne({ name, address }).session(session);
        if (existingBuilding) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Building with the same name and address already exists' });
        }

        // Create building
        const building = new Building({
            name,
            constructionCompany,
            address,
            city,
            country,
            pinCode,
            buildingContactNumber,
            officeAddress,
            officeContactNumber
        });

        // Save the building to the database
        await building.save({ session });

        // Check if an admin with the same mobile number and role is already registered
        const existingUser = await User.findOne({ mobileNumber, role: ROLES.BUILDING_ADMIN }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'User with this mobile number and role already exists' });
        }

        // Create building admin
        const buildingAdmin = new BuildingAdmin({
            mobileNumber: mobileNumber,
            role: ROLES.BUILDING_ADMIN,
            name: adminName,
            aadhar: aadhar,
            building: building._id
        });

        await buildingAdmin.save({ session });

        // Add the new admin to the building's buildingAdmins array
        building.buildingAdmins.push(buildingAdmin._id);
        await building.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Building and admin created successfully', building, buildingAdmin });
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
