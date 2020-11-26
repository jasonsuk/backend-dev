// Loading Bootcamp model
const { fail } = require('assert');
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
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc        Get a single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getSingleBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res
                .status(400)
                .json({ success: false, message: error.message });
        }

        res.status(200).json({
            success: true,
            requestTime: req.requestTime,
            message: bootcamp,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
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
        res.status(400).json({ success: false, message: error.message });
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
            return res
                .status(400)
                .json({ success: false, message: error.message });
        }

        res.status(200).json({
            success: true,
            requestTime: req.requestTime,
            data: bootcamp,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc        Delete a bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return res
                .status(400)
                .json({ success: false, message: error.message });
        }

        res.status(200).json({
            success: true,
            requestTime: req.requestTime,
            data: {},
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
