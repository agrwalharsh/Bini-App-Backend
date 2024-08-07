const User = require('../../models/userModel');
const VisitorRequest = require('../../models/visitorRequestModel')
const { ROLES } = require('../../utils/constants');
const { sendNotification } = require('../../utils/notificationService');

exports.updateVisitorRequestStatus = async (req, res) => {
    try {
        const { status, requestId } = req.body;
        const { userId } = req.user;

        if (!['approved', 'declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== ROLES.FLAT_ADMIN) {
            return res.status(403).json({ message: 'Only flat admin can approve or reject visitor requests' });
        }

        const visitorRequest = await VisitorRequest.findById(requestId);
        if (!visitorRequest) {
            return res.status(404).json({ message: 'Visitor request not found' });
        }

        if (visitorRequest.flatUser.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to approve/reject this request' });
        }

        visitorRequest.status = status;
        await visitorRequest.save();

        const securityUser = await User.findById(visitorRequest.security);
        const notificationPayload = {
            notification: {
                title: `Visitor Request ${status}`,
                body: `Your visitor request for ${visitorRequest.name} has been ${status}`
            }
        };
        sendNotification(securityUser.fcmTokens, notificationPayload);

        res.json({ message: `Visitor request ${status} successfully`, visitorRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update visitor request status' });
    }
};
