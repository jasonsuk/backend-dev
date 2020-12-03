const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');

const Course = require('../models/Courses');
const Bootcamp = require('../models/Bootcamps');

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

// @desc        Get a single course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new errorResponse(`No course find for the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        requestTime: req.requestTime,
        data: course,
    });
});

// @desc        Add a course : a course belongs to a specific bootcamp
// @route       POST /api/v1/bootcamp/:id/courses
// @access      Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    // Set a value of Course model's bootcamp field with the requested bootcamp id
    // Thus, there is no need to specify bootcamp field in req.body
    req.body.bootcamp = req.params.id;

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new errorResponse(
                `No bootcamp found for the id of ${req.params.id}`,
                404
            )
        );
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        requestTime: req.requestTime,
        data: course,
    });
});

// @desc        Update a course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return new errorResponse(
            `No course found for the id of ${req.params.id}`,
            404
        );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        requestTime: req.requestTime,
        data: course,
    });
});

// @desc        Delete a course
// @route       Delete /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return new errorResponse(
            `No course found for the id ${req.params.id}`,
            404
        );
    }

    // In order to pass through the mongoose middleware
    course.remove();

    res.status(200).json({
        success: true,
        requestTime: req.requestTime,
        data: {},
    });
});
