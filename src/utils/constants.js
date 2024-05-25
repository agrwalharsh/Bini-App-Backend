const CONSTANTS = {
    ERROR: {
        UNAUTHORIZED : "UnauthorizedError"
    },
    ROLES: {
        GLOBAL_ADMIN: 'globalAdmin',
        BUILDING_ADMIN: 'buildingAdmin',
        SECURITY: 'security',
        RESIDENT: 'resident'
    }
    // HTTP_STATUS: {
    //     OK: 200,
    //     CREATED: 201,
    //     BAD_REQUEST: 400,
    //     UNAUTHORIZED: 401,
    //     FORBIDDEN: 403,
    //     NOT_FOUND: 404,
    //     INTERNAL_SERVER_ERROR: 500
    // },
    // MESSAGES: {
    //     UNAUTHORIZED: 'Unauthorized',
    //     INVALID_TOKEN: 'Invalid token',
    //     DATA_NOT_FOUND: 'Data not found',
    //     INTERNAL_SERVER_ERROR: 'Internal server error'
    // },
};

module.exports = CONSTANTS;