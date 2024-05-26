const mongoose = require('mongoose')
const Building = require('../../models/buildingModel')
const BuildingAdmin = require('../../models/buildingAdminModel')
const Tower = require('../../models/towerModel')
const Subscription = require('../../models/subscriptionModel')

exports.deleteBuilding = async (req, res) => {
    const { buildingId } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the building by ID
        const building = await Building.findById(buildingId).session(session);
        if (!building) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Building not found' });
        }

        // Delete related building admins
        await BuildingAdmin.deleteMany({ building: buildingId }).session(session);

        // Delete related towers
        await Tower.deleteMany({ building: buildingId }).session(session);

        // Delete current and historical subscriptions
        const subscriptionIds = [building.currentSubscription, ...building.subscriptionHistory];
        await Subscription.deleteMany({ _id: { $in: subscriptionIds } }).session(session);

        // Finally, delete the building
        await Building.findByIdAndDelete(buildingId).session(session);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Building and all related data deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deleting building and related data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}