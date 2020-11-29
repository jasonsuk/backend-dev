const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

// Loading Bootcamp model
const Bootcamp = require('../models/Bootcamps');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    // try {
    //     const bootcamps = await Bootcamp.find();
    //     res.status(200).json({
    //         success: true,
    //         length: bootcamps.length,
    //         requestTime: req.requestTime,
    //         data: bootcamps,
    //     });
    // } catch (error) {
    //     // next(
    //     //     new errorResponse(`No bootcamp found for id ${req.params.id}`, 404)
    //     // );
    //     // Instead, we catch error here and handle a specific error in errorHandler.js
    //     next(error);
    // }
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
        success: true,
        length: bootcamps.length,
        requestTime: req.requestTime,
        data: bootcamps,
    });
});

// @desc        Get a single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new errorResponse(`No bootcamp found for id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({
        success: true,
        requestTime: req.requestTime,
        message: bootcamp,
    });
});

// @desc        Create a new bootcamp
// @route       GET /api/v1/bootcamps/
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        requestTime: req.requestTime,
        data: bootcamp,
    });
});

// @desc        Update a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return next(
            new errorResponse(`No bootcamp found for id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        requestTime: req.requestTime,
        data: bootcamp,
    });
});

// @desc        Delete a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(
            new errorResponse(`No bootcamp found for id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        requestTime: req.requestTime,
        data: {},
    });
});

// @desc        Get bootcamps within radius of input zipcode
// @route       GET /api/v1/bootcamps/:zipcode/:distance
// @access      Public
// @Reference    https://docs.mongodb.com/manual/reference/operator/query/centerSphere/

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    const loc = await geocoder.geocode(zipcode);
    const lng = loc[0].longitude;
    const lat = loc[0].latitude;

    // Convert distance to radians
    // The equatorial radius of the Earth is approximately 3,963.2 miles or 6,378.1 kilometers.
    // Unit of distance and radius is miles here as we are exploring bootcamps in US
    const radius = distance / 3963.2;

    console.log(lng, lat, radius);

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    console.log(bootcamps);

    res.status(200).json({
        success: true,
        length: bootcamps.length,
        requestTime: req.requestTime,
        data: bootcamps,
    });
});
