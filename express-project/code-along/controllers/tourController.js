// LOAD MODULES
const { findByIdAndDelete } = require('./../models/tourModel');
const Tour = require('./../models/tourModel');

// HTTP REQUESTS

// @ GET /api/v1/tours

async function getAllTours(req, res) {
    try {
        const tours = await Tour.find();

        res.status(200).json({
            status: 'success',
            requestTime: req.requestTime,
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        // 404 not found
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
}

// @ GET /api/v1/tours/:id

async function getSingleTour(req, res) {
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ id: req.params.id })

        res.status(200).json({
            status: 'success',
            requestTime: req.requestTime,
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.length > 0 ? err : 'Possibly invalid id requested',
        });
    }
}

// @ POST /api/v1/tours

async function addTour(req, res) {
    try {
        // const newTour = new Tour({req.body});
        // newTour.save();

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        // 400 bad request
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}

async function updateTour(req, res) {
    try {
        const productToUpdate = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                productToUpdate,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}

async function deleteTour(req, res) {
    try {
        const productToDelete = await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}

module.exports = {
    getAllTours,
    getSingleTour,
    addTour,
    updateTour,
    deleteTour,
};
