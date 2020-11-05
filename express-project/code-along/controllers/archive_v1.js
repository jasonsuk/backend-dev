// LOAD MODULES
const { findByIdAndDelete } = require('./../models/tourModel');
const Tour = require('./../models/tourModel');

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
        // BUILD QUERY

        // Query Examples

        // const query = Tour.find({ difficulty: 'easy', duration: 5 });
        // const query = Tour.find()
        //     .where('difficulty')
        //     .equals('easy')
        //     .where('duration')
        //     .equals('5');

        console.log(req.query);

        // 1a) Basic filtering - equals
        const queryObj = { ...req.query }; // important!
        const queriesToExclude = ['page', 'sort', 'limit', 'fields'];
        queriesToExclude.forEach((el) => delete queryObj[el]);

        // console.log(queryObj, req.query); // will show same if req.query not copied

        // 1b) Advanced filtering - gte, gt, lte, lt
        // req @ http://domain.com?query1=1&query2[gte]=2
        // console.log(queryObj); // { difficulty: 'easy', price: { gte: '500' } }

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(lt|lte|gt|gte)\b/g,
            (match) => `$${match}`
        );

        let query = Tour.find(JSON.parse(queryStr));
        // 2) Sorting
        // @ 127.0.0.1:3000/api/v1/tours?difficulty=easy&sort=price (sort)
        // @ 127.0.0.1:3000/api/v1/tours?difficulty=easy&sort=price,-ratingsAverage (multiple sorts)

        if (req.query.sort) {
            const sortReqMulti = req.query.sort.split(',').join(' ');
            query = query.sort(sortReqMulti); //.sort(price -ratingsAverage)
        } else {
            // Default
            query = query.sort('-createdAt');
        }

        // 3) Limiting fields
        // @ 127.0.0.1:3000/api/v1/tours?fields=name,price,difficulty,duration

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
            // or select: false in schema to limit response
        }

        // 4) Paigination
        // @ 127.0.0.1:3000/api/v1/tours?page=2&limit=10

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
        // Tour.skip(10).limit(10) // Page1 = 1-10, Page2 = 11-20

        // FOR skip > num of data
        const numData = await Tour.countDocuments();
        if (skip >= numData) throw new Error('No data exists');
        // then jump to catch statement

        // EXECUTE QUERY
        const tours = await query;

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
    sortTop5Tours,
    getAllTours,
    getSingleTour,
    addTour,
    updateTour,
    deleteTour,
};
