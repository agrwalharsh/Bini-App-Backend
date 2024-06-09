const UserModel = require("../../../models/userModel");
const tokenHandler = require("../../../auth/tokenHandler")

exports.setPassword = async(req, res) => {
    try{
        const { mobileNo, tempPassword, newPassword, role } = req.body;

        if (!mobileNo || !tempPassword || !newPassword || !role) {
            return res.status(400).json({ message: 'Mobile number, role, temporary password, and new password are required' });
        }

        // Find the user by mobile number and role
        const user = await UserModel.findOne({ mobileNumber: mobileNo, role: role });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attempt to reset the password
        try {
            const result = await user.resetPassword(tempPassword, newPassword);
            if (result) {
                // Generate a token (Assuming you have a function to generate JWT tokens)
                const token = tokenHandler.generateToken(user.id, '24h')

                return res.status(200).json({ message: 'Password has been reset successfully', token: token });
            }
        } catch (error) {
            console.log("Error: " + error.toString())
            return res.status(400).json({ message: error.message });
        }
    }catch(error){
        console.log("Error -> " + error.toString())
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
}