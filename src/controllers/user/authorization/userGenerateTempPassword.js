const UserModel = require("../../../models/userModel");
const CONSTANTS = require("../../../utils/constants");

exports.generateTemporaryPassword = async (req, res) => {
    try {
        const { userId } = req.user; // The user making the request
        const { id: targetUserId } = req.body; // The user for whom the temp password is being generated
        console.log("Target User Id -> " + targetUserId)

        const parentUser = await UserModel.findById(userId).select('role').lean();
        if (!parentUser) {
            return res.status(403).json({ message: 'User making the request not found' });
        }

        const targetUser = await UserModel.findById(targetUserId).select('role');
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        // Role-based restrictions
        if (parentUser.role === CONSTANTS.ROLES.GLOBAL_ADMIN) {
            if (targetUser.role !== CONSTANTS.ROLES.BUILDING_ADMIN) {
                return res.status(403).json({ message: 'Global Admin can only generate passwords for Building Admin' });
            }
        } else if (parentUser.role === CONSTANTS.ROLES.BUILDING_ADMIN) {
            if (![CONSTANTS.ROLES.FLAT_ADMIN, CONSTANTS.ROLES.SECURITY].includes(targetUser.role)) {
                return res.status(403).json({ message: 'Building Admin can only generate passwords for Flat Resident or Security' });
            }
        } else {
            return res.status(403).json({ message: 'You do not have permission to generate a temporary password' });
        }

        // Generate the temporary password
        const tempPassword = await targetUser.generateTempPassword();
        console.log(`Temporary password: ${tempPassword}`);
        res.status(200).json({ message: 'Temporary password generated successfully', tempPassword });

    } catch (error) {
        console.log("Error -> " + error.toString())
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
}
