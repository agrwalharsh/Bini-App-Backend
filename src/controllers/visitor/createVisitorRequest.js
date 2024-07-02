const User = require('../../models/userModel');
const VisitorRequest = require('../../models/visitorRequestModel')
const { ROLES } = require('../../utils/constants');
const WebSocketService = require('../../ws/websocketService')

exports.createVisitorRequest = async (req, res) => {
    try {
        const { name, number, purpose, flatUser } = req.body;
        const { userId } = req.user

        if (!name || !number || !purpose || !flatUser) {
            return res.status(400).json({
                message: "All fields are mandatory"
            })
        }
        const user = await User.findById(userId)
        if (!user || user.role != ROLES.SECURITY) {
            return res.status(403).json({
                message: "Only security can raise visitor request"
            })
        }

        const flatuser = await User.findById(flatUser)
        if (!flatuser || flatuser.role != ROLES.FLAT_ADMIN) {
            return res.status(400).json({
                message: "Invalid flat user"
            })
        }

        const newRequest = new VisitorRequest({
            name,
            number,
            purpose,
            flatUser,
            security: user._id // Assuming req.user contains the authenticated security user's details
        });

        await newRequest.save();

        WebSocketService.notifyClients({ type: 'visitor_request_update', userId: flatUser });


        res.status(201).json({ message: 'Visitor request created successfully', newRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create visitor request' });
    }
}
