// LOAD MODULES
const { findByIdAndDelete } = require('./../models/tourModel');
const Tour = require('./../models/tourModel');
const APIfeatures = require('./../utils/apiFeatures');

// MIDDLEWARE - ALIASING
function sortTop5Tours(req, res, next) {
    // @ api/v1/tours?limit=5&sort=-ratingAverage,price
    // req.query = { limit: '5', sort: '-ratingAverage,price' }
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    next();
}

// HTTP REQUESTS

// @ GET /api/v1/tours

async function getAllTours(req, res) {
    try {
        // EXECUTE QUERY
        const features = new APIfeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;

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

// @ PATCH /api/v1/tours/:id

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

// @ DELETE /api/v1/tours/:id

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

// FOR AGGREGATION ROUTES
async function getTourStats(req, res) {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }, // default
            },
            {
                $group: {
                    // _id: null, // load all
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    avgRatings: { $avg: '$ratingsAverage' },
                    avgDuration: { $avg: '$duration' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
            // {
            //     $match: { _id: { $ne: '$EASY' } },
            // },
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
            message: err,
        });
    }
}

// GET @ /api/v1/tours/monthly-stats/:year

async function getMonthlyTourStats(req, res) {
    try {
        const year = req.params.year * 1;

        const monthlyStats = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numToursStart: { $sum: 1 },
                    tours: { $push: '$name' },
                },
            },
            {
                $addFields: { month: '$_id' },
            },
            {
                $project: { _id: 0 },
            },
            {
                $sort: { month: 1 },
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
            message: err,
        });
    }
}

module.exports = {
    sortTop5Tours,
    getAllTours,
    getSingleTour,
    addTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyTourStats,
};
