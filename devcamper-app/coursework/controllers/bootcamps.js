const errorResponse = require('../utils/errorResponse');

// Loading Bootcamp model
const Bootcamp = require('../models/Bootcamps');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getAllBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            success: true,
            length: bootcamps.length,
            requestTime: req.requestTime,
            data: bootcamps,
        });
    } catch (error) {
        next(error);
    }
};

// @desc        Get a single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getSingleBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return next(
                new errorResponse(
                    `No bootcamp found for id ${req.params.id}`,
                    404
                )
            );
        }
        res.status(200).json({
            success: true,
            requestTime: req.requestTime,
            message: bootcamp,
        });
    } catch (error) {
        // next(
        //     new errorResponse(`No bootcamp found for id ${req.params.id}`, 404)
        // );
        // Instead, we catch error here and handle a specific error in errorHandler.js
        next(error);
    }
};

// @desc        Create a new bootcamp
// @route       GET /api/v1/bootcamps/
// @access      Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            requestTime: req.requestTime,
            data: bootcamp,
        });
    } catch (error) {
        next(error);
    }
};

// @desc        Update a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!bootcamp) {
            return next(
                new errorResponse(
                    `No bootcamp found for id ${req.params.id}`,
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            requestTime: req.requestTime,
            data: bootcamp,
        });
    } catch (error) {
        next(error);
    }
};

// @desc        Delete a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return next(
                new errorResponse(
                    `No bootcamp found for id ${req.params.id}`,
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            requestTime: req.requestTime,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
