const Building = require('../../models/buildingModel');

exports.getBuildingPreviousStartDates = async (req, res) => {
    const { id } = req.params;

    try {
        const building = await Building.findById(id);

        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }

        const { previousStartDates } = building.subscription;

        res.status(200).json({ previousStartDates });
    } catch (error) {
        console.error('Error fetching previous start dates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};