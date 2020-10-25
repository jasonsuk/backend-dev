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

    // if (id < tours.length) {}
    if (tour) {
        res.status(200).json({
            status: 'success',
            requestTime: req.requestTime, // middleware
            data: {
                tour,
            },
        });
    } else {
        res.status(404).json({ message: `No page found with id ${id}` });
    }
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
    const reqId = req.params.id * 1;
    const reqTour = tours.find((tour) => tour.id === reqId);

    if (reqTour) {
        const reqBody = req.body;
        const { name, duration, maxGroupSize, difficulty } = reqBody;

        const newData = {
            name: name || reqTour.name,
            duration: duration || reqTour.duration,
            maxGroupSize: maxGroupSize || reqTour.maxGroupSize,
            difficulty: difficulty || reqTour.dificulty,
        };

        const updatedProduct = update(reqId, newData);
        res.status(200).json({
            status: 'success',
            data: {
                updatedProduct,
            },
        });
    } else {
        res.status(404).json({
            msg: 'Page not found',
        });
    }
}

function deleteTour(req, res) {
    const delId = req.params.id * 1;
    const delTour = tours.find((tour) => tour.id === delId);

    if (delTour) {
        remove(delId);

        res.status(204).json({
            msg: 'Success',
        });
    } else {
        res.status(404).json({
            msg: 'Page not found',
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
