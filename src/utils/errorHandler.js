const CONSTANTS = require("./constants");

function errorHandler(err, req, res, next) {
    if (err.name === CONSTANTS.ERROR.UNAUTHORIZED) {
        console.log("Invalid auth!!!")
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    next(err);
}

module.exports = errorHandler;