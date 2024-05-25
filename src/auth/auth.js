const { verifyToken } = require("../auth/tokenHandler");
const CONSTANTS = require("../utils/constants");
const errorHandler = require("../utils/errorHandler");

async function validateAuth(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
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

module.exports = {
    validateAuth
};
