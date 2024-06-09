const { verifyToken } = require("../auth/tokenHandler");
const userModel = require("../models/userModel");
const { ERROR } = require("../utils/constants");
const CONSTANTS = require("../utils/constants");
const errorHandler = require("../utils/errorHandler");

async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    req.token = authorization
    console.log("Token -> " + req.token)
    try {
        const payload = await verifyToken(authorization);
        if (payload) {
            console.log(payload)
            req.user = payload
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    } catch (err) {
        console.log(err.toString())
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}


const checkLatestToken = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.userId);

        if (user.allowedMultipleDevices) {
            if (!user.tokens.includes(req.token)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        } else {
            if (user.latestToken !== req.token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
        next();
    } catch (err) {
        console.log(err.toString())
        res.status(500).json({ message: 'Server error!' });
    }
};

async function validateAuth(req, res, next) {
    try {
        await validateToken(req, res, async (err) => {
            if (err) return next(err);
            await checkLatestToken(req, res, next);
        });
    } catch (err) {
        console.log(err.toString())
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}

module.exports = {
    validateAuth
};
