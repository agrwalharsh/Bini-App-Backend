const Building = require('../../models/buildingModel')

exports.getBuildingsTowerData = async (req, res) => {
    try {
        const buildings = await Building.find({})
            .populate('towers')
            .select('id name constructionCompany address towers');

        res.status(200).json(buildings);
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}