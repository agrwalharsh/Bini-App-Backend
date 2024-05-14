const { verifyToken } = require("../auth/tokenHandler");
const CONSTANTS = require("../utils/constants");

async function validateAuth(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new Error(CONSTANTS.ERROR.UNAUTHORIZED);
    }
    try {
        const payload = await verifyToken(authorization);
        if (payload) {
            next();
        } else {
            throw new Error(CONSTANTS.ERROR.UNAUTHORIZED);
        }
    } catch (err) {
        throw new Error(CONSTANTS.ERROR.UNAUTHORIZED);
    }
}

module.exports = {
    validateAuth,
};
