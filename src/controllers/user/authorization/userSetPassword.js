const mongoose = require('mongoose');
const UserModel = require("../../../models/userModel");
const tokenHandler = require("../../../auth/tokenHandler");

exports.setPassword = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { mobileNo, tempPassword, newPassword, role } = req.body;

        if (!mobileNo || !tempPassword || !newPassword || !role) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Mobile number, role, temporary password, and new password are required' });
        }

        // Find the user by mobile number and role
        const user = await UserModel.findOne({ mobileNumber: mobileNo, role: role }).session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'User not found' });
        }

        // Attempt to reset the password
        try {
            const result = await user.resetPassword(tempPassword, newPassword, { session });

            if (result) {
                // Generate a token (Assuming you have a function to generate JWT tokens)
                const token = tokenHandler.generateToken(user.id, '24h');

                if (user.allowedMultipleDevices) {
                    user.tokens.push(token);
                } else {
                    user.latestToken = token;
                }

                // Save the user with the new token
                await user.save({ session });

                await session.commitTransaction();
                session.endSession();

                return res.status(200).json({ message: 'Password has been reset successfully', token: token, mobileNumber: user.mobileNumber, role: user.role });
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log("Error: " + error.toString());
            return res.status(400).json({ message: error.message });
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log("Error -> " + error.toString());
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
