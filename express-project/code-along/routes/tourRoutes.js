const express = require('express');
const { route } = require('../app');
const router = express.Router();

// Local Module from from controllers/tourController.js
const {
    sortTop5Tours,
    getAllTours,
    getSingleTour,
    addTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyTourStats,
} = require('../controllers/tourController');

// Aliasing routes with middleware
router.route('/top-5-tours').get(sortTop5Tours, getAllTours);
// Aggregation pipeline
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-stats/:year').get(getMonthlyTourStats);
// HTML requests
router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
