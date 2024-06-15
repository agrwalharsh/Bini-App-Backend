const User = require('../../models/userModel');
const VisitorRequest = require('../../models/visitorRequestModel')
const { ROLES } = require('../../utils/constants');

exports.getSecurityVisitorRequests = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId);
        if (!user || user.role !== ROLES.SECURITY) {
            return res.status(403).json({ message: 'Only security can view visitor requests' });
        }

        const requests = await VisitorRequest.find({ security: userId })
            .populate('flatUser', 'flatNumber')
            .sort({ createdAt: -1 });

        const transformedRequests = requests.map(request => ({
            _id: request._id,
            name: request.name,
            number: request.number,
            purpose: request.purpose,
            flatUserID: request.flatUser._id,
            flatNumber: request.flatUser.flatNumber,
            security: request.security,
            status: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt
        }));

        res.status(200).json({ requests: transformedRequests });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch visitor requests' });
    }
};