const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @DESC : PROTECT ROUTES FROM UNAUTHORIZED ACCESS
// @TYPE : MIDDLEWARE BEFORE PRVIATE REQUESTS IN ROUTES
exports.protect = asyncHandler(async (req, res, next) => {
    // Initialize token
    let token;

    // Assign to token if exists from private requests
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') // Check the correct format
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Assign to token if exists from cookies
    // else if(req.cookies) {
    //     token = req.cookies.token
    // }
    else {
        next(new ErrorResponse('Not authorized to access the route'), 401);
    }

    // Decode and verify token
    // When decoded, returns i.e. { id: '5fcde94e1d7ea611a556ab87', iat: 1607330138, exp: 1609922138 }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decoded);

        req.user = await User.findById(decoded.id);
        // console.log(req.user);
        next();
    } catch (error) {
        next(new ErrorResponse('Not authorized to access the route'), 401);
    }
});

// @DESC : AUTHORIZE ACCESS BY ROLE OF USERS : ONLY SPECIFIED ROLES ADD/DELETE BOOTCAMP OR COURSE
// @TYPE : MIDDLEWARE BEFORE PRVIATE REQUESTS IN ROUTES
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access the route`
                ),
                403
            ); // Forbidden
        }
        next();
    };
};
