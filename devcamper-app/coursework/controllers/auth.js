const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc        Register user
// @route       POST /api/v1/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
    // Destructure the required fields
    const { name, email, role, password } = req.body;

    const user = await User.create({
        name,
        email,
        role,
        password,
    });

    res.status(200).json({
        success: true,
        requestTime: req.requestTime,
        data: user,
    });
});
