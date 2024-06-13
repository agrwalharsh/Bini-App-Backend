// const express = require('express');
// const mongoose = require('mongoose');
// const UserModel = require("../../../models/userModel");
// const tokenHandler = require("../../../auth/tokenHandler");
// const authMiddleware = require("../../../middleware/authMiddleware"); // Assuming you have an auth middleware to get user from token

// const router = express.Router();

// router.post('/logout', authMiddleware, async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const { userId, token } = req.user;

//         // Find the user by ID
//         const user = await UserModel.findById(userId).session(session);
//         if (!user) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(404).json({ message: 'User not found' });
//         }

//         if (!token) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(401).json({ message: 'No token provided' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await UserModel.findById(decoded.id).session(session);

//         if (!user || (user.allowedMultipleDevices ? !user.tokens.includes(token) : user.latestToken !== token)) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(401).json({ message: 'Invalid token' });
//         }

//         // Remove the token
//         user.logout(token);

//         // Save the changes
//         await user.save({ session });

//         await session.commitTransaction();
//         session.endSession();

//         return res.status(200).json({ message: 'Logged out successfully' });
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         console.error('Error logging out:', error);
//         return res.status(500).json({ message: 'Internal server error', error: error.toString() });
//     }
// });

// module.exports = router;
