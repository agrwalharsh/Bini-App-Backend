// controllers/adminController.js
const globalAdminModel = require('../../../models/globalAdminModel');
const User = require('../../../models/userModel');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../../../utils/constants');
const tokenHandler = require('../../../auth/tokenHandler')
const mongoose = require('mongoose')

exports.createGlobalAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extract inputs from request body
        const { adminName, mobileNumber, password } = req.body;

        // Validate inputs
        if (!adminName || !mobileNumber || !password) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Admin Name, mobile number, and password are required' });
        }

        // Check if a user with the same mobile number already exists
        const existingUser = await User.findOne({ mobileNumber, role: ROLES.GLOBAL_ADMIN }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'A GlobalAdmin with the same mobile number already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create GlobalAdmin user
        const globalAdmin = new globalAdminModel({
            adminName,
            mobileNumber,
            password: hashedPassword,
            role: ROLES.GLOBAL_ADMIN
        });

        // Save the GlobalAdmin to the database
        await globalAdmin.save({ session });

        // Create JWT token
        const token = tokenHandler.generateToken(globalAdmin.id, '1000h')

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ 
            message: 'GlobalAdmin created successfully', 
            globalAdmin,
            token 
        });
    } catch (error) {
        // Abort the transaction in case of error
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
