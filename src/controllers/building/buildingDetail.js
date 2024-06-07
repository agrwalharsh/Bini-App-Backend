const Building = require('../../models/buildingModel');
const subscriptionModel = require('../../models/subscriptionModel');
const userModel = require('../../models/userModel');
const mongoose = require('mongoose')

exports.getBuildingDetails = async (req, res) => {
    try {
        const { userId } = req.user; // Assuming userId is available in req.user

        // Fetch the user to get the buildingId
        const user = await userModel.findById(userId)
        //.select('building').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("User -> " + user)

        const buildingId = user.building;
        console.log("Building Id -> " + buildingId)

        const building = await Building.aggregate([
            {
                $match: { _id: buildingId }
            },
            {
                $lookup: {
                    from: "users",
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
                    from: "subscriptions",
                    localField: "currentSubscription",
                    foreignField: "_id",
                    as: "currentSubscription"
                }
            },
            {
                $lookup: {
                    from: "towers",
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

        if (!building || building.length === 0) {
            return res.status(404).json({ message: 'Building not found' });
        }

        res.status(200).json({ building: building[0] });
    } catch (error) {
        console.error('Error fetching building details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};