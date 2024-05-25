const Building = require('../../models/buildingModel');

// Function to fetch all building details
exports.getAllBuildings = async (req, res) => {
    try {
        // Find all buildings and populate the buildingAdmins field
        const buildings = await Building.find();

        // Return the buildings in the response
        res.status(200).json({ buildings });
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};