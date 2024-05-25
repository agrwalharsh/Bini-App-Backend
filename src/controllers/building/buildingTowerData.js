const Building = require('../../models/buildingModel')

exports.getBuildingsTowerData = async (req, res) => {
    try {
        const buildings = await Building.find({})
            .populate('towers')
            .select('id name constructionCompany address towers');

        if (buildings.length === 0) {
            return res.status(200).json({ message: 'No buildings found' });
        }

        res.status(200).json({
            message: 'Buildings retrieved successfully',
            data: buildings
        });
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};