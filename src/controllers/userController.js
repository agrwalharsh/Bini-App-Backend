const User = require('../models/userModel');

exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Create new user
        const newUser = new User({ username, password, role });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
