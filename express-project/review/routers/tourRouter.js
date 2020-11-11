const express = require('express');
const { route } = require('../app');
const router = express.Router();

const {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyTourStats,
} = require('../controllers/tourController');

router.route('/get-stats').get(getTourStats);
router.route('/get-monthly-stats/:year').get(getMonthlyTourStats);

router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
