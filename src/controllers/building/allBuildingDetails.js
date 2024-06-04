const Building = require('../../models/buildingModel');
const subscriptionModel = require('../../models/subscriptionModel');

// Function to fetch all building details
exports.getAllBuildings = async (req, res) => {
    try {
        const buildings = await Building.aggregate([
            {
                $lookup: {
                    from: "users", // Assuming the collection name is "users"
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "buildingAdmins",
                    foreignField: "_id",
                    as: "buildingAdmins"
                }
            },
            {
                $lookup: {
                    from: "subscriptions", // Assuming the collection name is "subscriptions"
                    localField: "currentSubscription",
                    foreignField: "_id",
                    as: "currentSubscription"
                }
            },
            {
                $lookup: {
                    from: "towers", // Assuming the collection name is "towers"
                    localField: "towers",
                    foreignField: "_id",
                    as: "towers"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    constructionCompany: 1,
                    address: 1,
                    buildingContactNumber: 1,
                    officeAddress: 1,
                    officeContactNumber: 1,
                    createdBy: { $arrayElemAt: ["$createdBy", 0] }, // Extracting the first element from the array
                    buildingAdmins: 1,
                    currentSubscription: { $arrayElemAt: ["$currentSubscription", 0] }, // Extracting the first element from the array
                    towers: 1,
                    isActive: 1,
                    maxNoOfAdmins: 1
                }
            }
        ]);

        res.status(200).json({buildings: buildings});
    } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};