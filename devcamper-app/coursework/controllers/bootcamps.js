const path = require('path');
const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

// Loading Bootcamp model
const Bootcamp = require('../models/Bootcamps');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedQueryResults); // from advancedQuery middleware
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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new errorResponse(`No bootcamp found for id ${req.params.id}`, 404)
        );
    }

    // Trigger mongoose middleware
    bootcamp.remove();

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

    // console.log(lng, lat, radius);

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    // console.log(bootcamps);

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        requestTime: ßeq.requestTime,
        data: bootcamps,
    });
});

// @desc        Upload a photo
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private

exports.uploadPhoto = asyncHandler(async (req, res, next) => {
    // Check if bootcamp exists, or return error
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new errorResponse(
                `No bootcamp found for the id of ${req.params.id}`,
                404
            )
        );
    }

    // Check if file has been uploaded, or return error
    if (!req.files) {
        console.log(req.files);
        return next(new errorResponse('Please add a file', 400));
    }

    // File object
    const file = req.files.files;
    // console.log(file);

    // Validate if file is really a photo
    if (!file.mimetype.startsWith('image')) {
        return next(
            new errorResponse('Please check the file type to be a photo', 400)
        );
    }

    // Limit the file size to 1 megabyte i.e. 58kb = 58000
    if (!file.size > process.env.MAX_LIMIT_FILE_UPLOAD) {
        return next(
            new errorResponse(
                `Sorry...the file size must not exceed ${process.env.MAX_LIMIT_FILE_UPLOAD}`
            )
        );
    }

    // Use the mv() method to place the file somewhere on the server
    // Rewrite to a custom file name
    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new errorResponse('Failed to upload the file'), 500);
        }

        // Update the database with the file
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        // Send a response
        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});
