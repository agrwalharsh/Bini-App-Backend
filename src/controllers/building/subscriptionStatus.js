const Building = require('../../models/buildingModel');

// Function to calculate days until or since expiry
const calculateDays = (endDate) => {
    const currentDate = new Date();
    return Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
};

exports.getAllBuildingsSortedBySubscription = async (req, res) => {
    try {
        const buildings = await Building.find({}).populate('currentSubscription').exec();

        // Prepare formatted buildings array
        const formattedBuildings = buildings.map(building => {
            const subscription = building.currentSubscription;
            let daysSinceExpiry = null;
            let daysUntilExpiry = null;
            let endDate = null;

            if (subscription) {
                endDate = new Date(subscription.endDate);
                daysSinceExpiry = endDate < new Date() ? calculateDays(endDate) : null;
                daysUntilExpiry = endDate >= new Date() ? calculateDays(endDate) : null;
            }

            return {
                buildingId: building._id,
                name: building.name,
                constructionCompany: building.constructionCompany,
                address: building.address,
                endDate: endDate,
                daysSinceExpiry: daysSinceExpiry,
                daysUntilExpiry: daysUntilExpiry
            };
        });

        // Sort formatted buildings by days since expiry or until expiry
        formattedBuildings.sort((a, b) => {
            if (a.daysSinceExpiry !== null && b.daysSinceExpiry !== null) {
                return b.daysSinceExpiry - a.daysSinceExpiry; // Sort by days since expiry descending
            } else if (a.daysSinceExpiry !== null) {
                return -1; // 'a' has expired, show it first
            } else if (b.daysSinceExpiry !== null) {
                return 1; // 'b' has expired, show it first
            } else {
                return a.daysUntilExpiry - b.daysUntilExpiry; // Sort by days until expiry ascending
            }
        });

        res.status(200).json({ buildings: formattedBuildings });
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
