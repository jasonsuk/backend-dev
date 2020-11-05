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
} = require('../controllers/tourController');

// Aliasing routes with middleware
router.route('/top-5-tours').get(sortTop5Tours, getAllTours);

router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
