const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../../models/userModel');
const tokenHandler = require('../../../auth/tokenHandler')

exports.loginUser = async (req, res) => {
    const { mobileNumber, password, role, fcmToken } = req.body;

    try {
        const user = await userModel.findOne({ mobileNumber: mobileNumber, role: role });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = tokenHandler.generateToken(user._id, '24h');

        if (user.allowedMultipleDevices) {
            user.tokens.push(token);
        } else {
            user.latestToken = token;
        }
        
        if (fcmToken) {
            await user.addFcmToken(fcmToken);
        }

        await user.save();

        res.json({ token: token, mobileNumber: user.mobileNumber, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}