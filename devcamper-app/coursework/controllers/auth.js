const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// @desc        Register user
// @route       POST /api/v1/auth/register
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
// @route       POST /api/v1/auth/signin
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

// @desc        Get signed in user
// @route       GET /api/v1/auth/whoisme
// @access      Public
// @annecdote   find user by req.user.id (assigned for protect middleware)
exports.whoisme = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id); // req.user object @ proect middleware auth.js

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Forgot password
// @route       POST /api/v1/auth/forgotPassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // Gets email in req.body
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new errorResponse('There is no user with the email'), 404); // Not found
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Send email with message (resetUrl w/ token attached)
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/auth/resetPassword/${resetToken}`;

    // If frontend, there may be a link to frontend page for password retrieval
    const text = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:\n\n${resetUrl}`;

    try {
        await sendEmail({
            // options
            email: user.email,
            subject: 'Password reset token',
            text,
        });
        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
        console.error(err);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new errorResponse('Email could not be sent'), 500);
    }
});

// @desc        Reset password
// @route       PUT /api/v1/auth/resetPassword/:resetToken
// @access      Public
// @remark      @forgotPasssword : model saved hashed, user received unhased token (via email)
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    // Find user matching the hashed token
    const user = await User.findOne({
        // Check if token is expired
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new errorResponse('Invalid token'), 400);
    }

    // Get new password if reset token matched + not expired,
    user.password = req.body.password;
    // Void reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send back token as response
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
