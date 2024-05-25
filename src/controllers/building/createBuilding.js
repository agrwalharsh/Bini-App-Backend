// controllers/buildingController.js
const Building = require('../../models/buildingModel');
const User = require('../../models/userModel');
const { ROLES } = require('../../utils/constants');

exports.createBuilding = async (req, res) => {
    try {
        // Extract user ID from decoded token payload
        const { userId } = req.user;

        // Retrieve user from the database
        console.log("userId -> " + userId)
        // const user = await User.findById(userId);
        const user = await User.findById(userId).select('role').lean();

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        // Check if the user has the required role (globalAdmin)
        if (user.role !== ROLES.GLOBAL_ADMIN) {
            return res.status(403).json({ message: 'Only globalAdmin is authorized to register buildings' });
        }

        // Extract inputs from request body
        const { name, constructionCompany, address } = req.body;

        // Validate inputs
        if (!name || !constructionCompany || !address) {
            return res.status(400).json({ message: 'Name, construction company, and address are required' });
        }

        // Create building object with default dates
        const building = new Building({
            name,
            constructionCompany,
            address,
            createdBy: userId
        });

        // Save the building to the database
        await building.save();

        res.status(201).json({ message: 'Building registered successfully', building });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(404).json({ message: 'Building with the same name and address already exists' });
        }
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
