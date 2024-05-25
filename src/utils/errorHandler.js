const CONSTANTS = require("./constants");

function errorHandler(err, req, res, next) {

    console.error(err); // Log the error for debugging purposes

    if (err.name === CONSTANTS.ERROR.UNAUTHORIZED) {
        console.log("Invalid auth!!!")
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }else{
        return res.status(500).json({ message: 'Internal server error' });

    }
}

module.exports = errorHandler;