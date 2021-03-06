const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
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

// @desc        Log in user
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password - no mongoose validation
    if (!email || !password) {
        return next(
            new ErrorResponse('Please enter an email and a password'),
            400
        );
    }

    // Get a user instance that matches with the input email
    const user = await User.findOne({ email }).select('+password'); // @ schema password is not to be shown so need adding in

    // See if database hold the input data
    if (!user) {
        return next(new ErrorResponse('No credentials found'), 401); // 401 unauthorized
    }

    // Check password - match with the data in db
    // UserSchema.methods.matchPassword onto 'user' instance
    const isPasswordMatched = await user.matchPassword(password); // returns boolean
    if (!isPasswordMatched) {
        return next(new ErrorResponse('No credentials found'), 401); // 401 unauthorized
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

// @desc        Log user out & clear token cookie
// @route       GET /api/v1/auth/logout
// @access      Public
exports.logout = asyncHandler(async (req, res, next) => {
    // Set token to none
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 60 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc        Get signed in user
// @route       GET /api/v1/auth/whoisme
// @access      Public

// @desc        Get signed in user
// @route       GET /api/v1/auth/whoisme
// @access      Public
// @remark      Find user by req.user.id (assigned for protect middleware)
exports.whoisme = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id); // req.user object @ proect middleware auth.js

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Update user details (name, email only)
// @route       PUT /api/v1/auth/updateuserdetails
// @access      Private (via protect middelware)
exports.updateDetails = asyncHandler(async (req, res, next) => {
    // Only name and email can be changed (= no access to password and role)
    const fieldsToChange = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToChange, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Update password
// @route       PUT /api/v1/auth/updatepassword
// @access      Private (via protect middelware)
exports.updatePassword = asyncHandler(async (req, res, next) => {
    // req.body = { "currentPassword": 123456, "newPassword": 1234567 }

    const user = await User.findById(req.user.id).select('+password');

    // No need to validate user as user has logged in
    // Check if input current password matches
    const isPasswordMatch = await user.matchPassword(req.body.currentPassword);

    if (!isPasswordMatch) {
        return next(new ErrorResponse('Password do not match'), 401);
    }

    // Change password and save it
    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc        Forgot password
// @route       POST /api/v1/auth/forgotPassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // Gets email in req.body
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse('There is no user with the email'), 404); // Not found
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Send email with message (resetUrl w/ token attached)
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/auth/resetpassword/${resetToken}`;

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

        return next(new ErrorResponse('Email could not be sent'), 500);
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
        return next(new ErrorResponse('Invalid token'), 400);
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

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    // Send cookie with token in it
    // key, value, options
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};
