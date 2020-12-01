const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');

const Course = require('../models/Courses');

// @desc        Get all courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamp/:id/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.id) {
        query = Course.find({ bootcamp: req.params.id });
    } else {
        // Find all courses and expand bootcamp field
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description',
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        requestTime: req.requestTime,
        data: courses,
    });
});
