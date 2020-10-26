const express = require('express');
const { route } = require('../app');
const router = express.Router();

// Local Module from from controllers/tourController.js
const {
    getAllTours,
    getSingleTour,
    addTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody,
} = require('../controllers/tourController');

router.param('id', checkID);

router.route('/').get(getAllTours).post(checkBody, addTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
