const User = require('../../models/userModel');
const VisitorRequest = require('../../models/visitorRequestModel')
const { ROLES } = require('../../utils/constants');

exports.getFlatAdminVisitorRequests = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId);
        if (!user || user.role !== ROLES.FLAT_ADMIN) {
            return res.status(403).json({ message: 'Only flat admin can view visitor requests' });
        }

        const requests = await VisitorRequest.find({ flatUser: userId }).sort({ createdAt: -1 });

        res.status(200).json({ requests: requests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch visitor requests' });
    }
};