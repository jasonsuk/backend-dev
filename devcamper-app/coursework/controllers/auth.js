const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc        Register user
// @route       POST /api/v1/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
    // Destructure the required fields
    const { name, email, role, password } = req.body;

    // Mongoose will validate the inputs in accordance to User Schema
    const user = await User.create({
        name,
        email,
        role,
        password,
    });

    // const token = user.getJwtToken();

    // res.status(200).json({
    //     success: true,
    //     requestTime: req.requestTime,
    //     token,
    // });

    sendTokenResponse(user, 200, res);
});

// @desc        Signin user
// @route       POST /api/v1/signin
// @access      Public
exports.signin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password - no mongoose validation
    if (!email || !password) {
        return next(
            new errorResponse('Please enter an email and a password'),
            400
        );
    }

    // Get a user instance that matches with the input email
    const user = await User.findOne({ email }).select('+password'); // @ schema password is not to be shown so need adding in

    // See if database hold the input data
    if (!user) {
        return next(new errorResponse('No credentials found'), 401); // 401 unauthorized
    }

    // Check password - match with the data in db
    // UserSchema.methods.matchPassword onto 'user' instance
    const isPasswordMatched = user.matchPassword(password); // returns boolean
    if (!isPasswordMatched) {
        return next(new errorResponse('No credentials found'), 401); // 401 unauthorized
    }

    // // Create token for user data
    // const token = user.getJwtToken();

    // res.status(200).json({
    //     success: true,
    //     requestTime: req.requestTime,
    //     token,
    // });
    sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token for user data
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if ((process.env.NODE_ENV = 'production')) {
        options.secure = true;
    }

    // Send cookie with token in it
    // key, value, options
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};

// @desc        Get signed in user
// @route       GET /api/v1/whoisme
// @access      Private
// @annecdote   find user by req.user.id (assigned for protect middleware)
exports.whoisme = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id); // req.user object @ proect middleware auth.js

    res.status(200).json({
        success: true,
        data: user,
    });
});
