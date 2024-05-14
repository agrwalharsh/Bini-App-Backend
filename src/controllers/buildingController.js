const Building = require('../models/buildingModel');

exports.registerBuilding = async (req, res) => {
    try {
        const { buildingName, constructionCompany, address, token } = req.body;

        // Check if token is valid (You need to implement token verification logic)

        // Create building
        const building = new Building({ name: buildingName, constructionCompany, address });
        await building.save();

        res.json({ success: true, message: 'Building registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
