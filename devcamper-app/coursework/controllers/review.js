const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamps');

// @desc        Get all reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/bootcamp/:id/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.id) {
        const reviews = await Review.find({ bootcamp: req.params.id });

        res.status(200).json({
            success: true,
            count: reviews.length,
            requestedAt: req.requestTime,
            data: reviews,
        });
    } else {
        res.status(200).json(res.advancedQueryResults);
    }
});

// @desc        Get a single review
// @route       GET /api/v1/reviews/:id
// @access      Public
exports.getSingleReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description',
    });

    if (!review) {
        return next(
            new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        requestedAt: req.requestTime,
        data: review,
    });
});

// @desc        Create a review (dependent on a specific bootcamp)
// @route       POST /api/v1/bootcamp/:id/reviews
// @access      Private/user, admin (no publisher access)
// @remark      req.body = { "title": , "text", "rating" }
exports.createReview = asyncHandler(async (req, res, next) => {
    // Add bootcamp & user id to req.body
    req.body.bootcamp = req.params.id;
    req.body.user = req.user.id;

    // Check if bootcamp exists
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `No bootcamp found with the id of ${req.params.id}`,
                404
            )
        ); // not found
    }

    // Create a new review if bootcamp exists
    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        requestedAt: req.requestTime,
        data: review,
    });
});

// @desc        Update a review
// @route       PUT /api/v1/reviews/:id
// @access      Private/user(specific), admin
exports.updateReview = asyncHandler(async (req, res, next) => {
    // Find the reqested review
    let review = await Review.findById(req.params.id);
    // Check if the requested review existsZ
    if (!review) {
        return next(
            new ErrorResponse(`No review found for the id of ${req.params.id}`),
            404
        ); // 404 not found
    }
    // Check if the review belongs to the log in user or user is admin
    // Note review.user type is mongoose ObjectId : convert into String
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to access the route`),
            401
        ); // 401 unauthorized
    }
    // Update the review
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    // Send response
    res.status(200).json({
        success: true,
        requestedAt: req.requestTime,
        data: review,
    });
});

// @desc        Delete a review
// @route       DELETE /api/v1/reviews/:id
// @access      Private/user(specific), admin
exports.deleteReview = asyncHandler(async (req, res, next) => {
    // Get review
    const review = await Review.findById(req.params.id);
    // Check if review exists
    if (!review) {
        return next(
            new ErrorResponse(`No review found for the id of ${req.params.id}`),
            404
        );
    }
    // Check if the review belongs to the log in user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to access the route`),
            401
        );
    }
    // Remove review
    await review.remove();
    // Send response
    res.status(200).json({
        success: true,
        requestedAt: req.requestTime,
        data: {},
    });
});
