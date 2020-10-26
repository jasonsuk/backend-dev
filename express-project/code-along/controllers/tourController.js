// LOAD MODULES
const fs = require('fs');
const path = require('path');

// LOAD LOCAL DATA
const tours = require('../dev-data/data/tours-simple.json');
const dataFilePath = path.join(
    __dirname,
    '../dev-data',
    'data',
    'tours-simple.json'
);

// MIDDLEWARE

// param middleware - only applied to routes with :id
const checkID = (req, res, next, val) => {
    console.log(`Checking ID: ${val}`);
    if (req.params.id * 1 > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: 'No page found',
        });
    }
    next();
};

// chaining multiple middleware @added to POST
const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        res.status(404).json({
            status: 'fail',
            message: 'No name or price data sent',
        });
    }
    next();
};

// HELPER FUNCTION
function writeDataToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8', (err) => {
        console.log(err);
    });
}

function update(id, newData) {
    const index = tours.findIndex((tour) => tour.id === id);
    tours[index] = { id, ...newData };
    writeDataToFile(dataFilePath, tours);
    return tours[index];
}

function remove(id) {
    const updatedData = tours.filter((tour) => tour.id !== id);
    writeDataToFile(dataFilePath, updatedData);
}

// HTTP REQUESTS

// @ GET /api/v1/tours

function getAllTours(req, res) {
    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime, // middleware
        results: tours.length,
        data: {
            tours,
        },
    });
}

// @ GET /api/v1/tours/:id

function getSingleTour(req, res) {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime, // middleware
        data: {
            tour,
        },
    });
}

// @ POST /api/v1/tours

function addTour(req, res) {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    writeDataToFile(dataFilePath, tours);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
}

function updateTour(req, res) {
    const id = req.params.id * 1;
    const reqTour = tours.find((tour) => tour.id === id);

    const { name, duration, maxGroupSize, difficulty } = req.body;

    const newData = {
        name: name || reqTour.name,
        duration: duration || reqTour.duration,
        maxGroupSize: maxGroupSize || reqTour.maxGroupSize,
        difficulty: difficulty || reqTour.dificulty,
    };
    const updatedProduct = update(id, newData);
    res.status(200).json({
        status: 'success',
        data: {
            updatedProduct,
        },
    });
}

function deleteTour(req, res) {
    const id = req.params.id * 1;
    remove(id);

    res.status(204).json({
        msg: 'Success',
    });
}

module.exports = {
    getAllTours,
    getSingleTour,
    addTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody,
};
