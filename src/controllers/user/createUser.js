const User = require('../../models/userModel');
const Validators = require('../../utils/validators')
const tokenHandler = require('../../auth/tokenHandler')
const bcrypt = require('bcryptjs');
const CONSTANTS = require('../../utils/constants');

exports.createUser = async (req, res) => {
    try {
        const { mobileNumber, password, role } = req.body;
        // Validate role
        if (!Object.values(CONSTANTS.ROLES).includes(role)){
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Validate mobile number and password
        if (!Validators.isValidMobileNumber(mobileNumber)) {
            return res.status(400).json({ message: 'Invalid mobile number. It must be 10 digits long.' });
        }
        if (!Validators.isValidPassword(password)) {
            return res.status(400).json({ message: 'Password must be 8 characters long.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ mobileNumber, password: hashedPassword, role });
        await newUser.save();

        const token = tokenHandler.generateToken(newUser.id, '1000h')
        res.status(201).json({ message: 'User created successfully', user: newUser, token: token });
    } catch (error) {
        console.log(error)
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({ message: 'Mobile number already exists for this role' });
        }
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
