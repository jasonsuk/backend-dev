const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const User = require('../models/User');

// Controllers for /api/v1/auth/user route
// @access: Private/admin

// @desc        Get all users
// @route       GET /api/v1/auth/user
// @access      Private/admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedQueryResults);
});

// @desc        Get a single user
// @route       GET /api/v1/auth/user/:userid
// @access      Private/admin
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    // console.log(req.params.userid);
    const user = await User.findById(req.params.userid);

    res.status(200).json({
        success: true,
        requestedAt: req.reqestTime,
        data: user,
    });
});

// @desc        Create a user
// @route       POST /api/v1/auth/user/
// @access      Private/admin
exports.createUser = asyncHandler(async (req, res, next) => {
    // req.body = { "name": "User Account", "email": "user@gmail.com", "role": "user", "password": "123456" }
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        requestedAt: req.reqestTime,
        data: user,
    });
});

// @desc        Update a user
// @route       PUT /api/v1/auth/user/:userid
// @access      Private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.userid, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        requestedAt: req.reqestTime,
        data: user,
    });
});

// @desc        Delete a user
// @route       DELETE /api/v1/auth/user/:userid
// @access      Private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.userid);

    res.status(200).json({
        success: true,
        requestedAt: req.reqestTime,
        data: {},
    });
});
