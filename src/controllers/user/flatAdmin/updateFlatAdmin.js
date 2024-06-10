const mongoose = require('mongoose');
const FlatResident = require('../../../models/flatAdminModel');
const Tower = require('../../../models/towerModel');
const User = require('../../../models/userModel');
const { ROLES } = require('../../../utils/constants');

exports.updateFlatAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { flatAdminId, towerId, flatNumber, flatOwnerName, flatOwnerAadhar, flatOwnerNumber, isTenantPresent, tenantName, tenantAadhar, tenantNumber } = req.body;
        const { userId } = req.user;

        // Validate inputs
        if (!flatAdminId || !towerId || !flatNumber || !flatOwnerName || !flatOwnerAadhar || !flatOwnerNumber) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        if (isTenantPresent === true) {
            // Validate inputs
            if (!tenantName || !tenantAadhar || !tenantNumber) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'All required fields must be provided' });
            }
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
            return res.status(403).json({ message: 'Only building admin is authorized to update flat residents' });
        }

        // Check if the flat resident exists
        const flatResident = await FlatResident.findById(flatAdminId).session(session);
        if (!flatResident) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Flat resident not found' });
        }

        // Check if tower exists
        const tower = await Tower.findById(towerId).session(session);
        if (!tower) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Tower not found' });
        }

        // Determine loginNumber based on tenant presence
        const loginNumber = isTenantPresent ? tenantNumber : flatOwnerNumber;

        // Check if a resident with the same login number is already registered for this flat, except the current resident
        const existingResident = await FlatResident.findOne({
            mobileNumber: loginNumber,
            towerId,
            flatNumber,
            _id: { $ne: flatAdminId }
        }).session(session);
        if (existingResident) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Another resident with this login number is already registered for this flat' });
        }

        // Update flat resident details
        flatResident.towerId = towerId;
        flatResident.flatNumber = flatNumber;
        flatResident.flatOwnerName = flatOwnerName;
        flatResident.flatOwnerAadhar = flatOwnerAadhar;
        flatResident.flatOwnerNumber = flatOwnerNumber;
        flatResident.isTenantPresent = isTenantPresent;
        flatResident.mobileNumber = loginNumber;
        flatResident.updatedBy = userId;

        if (isTenantPresent) {
            flatResident.tenantName = tenantName;
            flatResident.tenantAadhar = tenantAadhar;
            flatResident.tenantNumber = tenantNumber;
        } else {
            flatResident.tenantName = undefined;
            flatResident.tenantAadhar = undefined;
            flatResident.tenantNumber = undefined;
        }

        await flatResident.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Flat resident updated successfully', flatResident });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: 'Mobile number already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
