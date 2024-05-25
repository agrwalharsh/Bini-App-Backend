const Building = require('../../models/buildingModel');
const mongoose = require('mongoose');
const Subscription = require('../../models/subscriptionModel')

exports.updateSubscription = async (req, res) => {
    const { buildingId, startDate } = req.body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        if (!startDate) {
            return res.status(400).json({ message: 'Start date is required' });
        }

        const building = await Building.findById(buildingId).populate('currentSubscription').session(session);

        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }

        if (building.currentSubscription && await building.isSubscriptionValid()) {
            // Update current subscription
            building.currentSubscription.metaData.push(`Updated startDate from ${building.currentSubscription.startDate} to ${startDate}`);
            building.currentSubscription.startDate = startDate;

            // Adjust endDate accordingly (example: increase by default duration)
            const newEndDate = new Date(startDate);
            newEndDate.setMonth(newEndDate.getMonth() + building.currentSubscription.durationInMonths);
            building.currentSubscription.endDate = newEndDate;

            await building.currentSubscription.save({ session });
        } else {
            // Create a new subscription for renewal
            const newSubscription = new Subscription({
                startDate: startDate,
                endDate: new Date(startDate).setMonth(new Date(startDate).getMonth() + 12), // Example: Renew for 1 year
                durationInMonths: 12, // Example: Renew for 1 year
                building: buildingId,
                metaData: [`Renewed subscription on ${startDate}`]
            });

            await newSubscription.save({ session });

            // Replace currentSubscription with the new subscription
            building.currentSubscription = newSubscription._id;

            // Move the current subscription to history
            building.subscriptionHistory.push(building.currentSubscription);
        }

        await building.save({ session });
        await session.commitTransaction();

        res.status(200).json({ message: 'Subscription updated successfully' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating subscription:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    } finally {
        session.endSession();
    }
}

