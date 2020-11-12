const { query } = require('express');
const Tour = require('../models/tourModel');
const QueryConstructor = require('../utils/queryConstructor');

async function getAllTours(req, res) {
    try {
        // EXECUTE QUERY
        const constructor = new QueryConstructor(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const allTours = await constructor.dataObj;

        res.status(200).json({
            status: 'success',
            tourCount: allTours.length,
            data: {
                allTours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
}
async function getTour(req, res) {
    try {
        const reqID = req.params.id;
        const tour = await Tour.findById(reqID);

        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        });
    }
}

async function addTour(req, res) {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}

async function updateTour(req, res) {
    try {
        const tourToUpdate = await Tour.findByIdAndUpdate(
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
                tourToUpdate,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}

async function deleteTour(req, res) {
    try {
        const tourToDelete = await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}

// AGGREGATE PIPELINE
async function getTourStats(req, res) {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: null,
                    countTours: { $sum: 1 },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgDuration: { $avg: '$duration' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}

async function getMonthlyTourStats(req, res) {
    try {
        const reqYear = req.params.year * 1;
        const monthlyStats = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${reqYear}-01-01`),
                        $lte: new Date(`${reqYear}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTours: { $sum: 1 },
                    tourNames: { $push: '$name' },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                monthlyStats,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}

module.exports = {
    getAllTours,
    getTour,
    addTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyTourStats,
};
