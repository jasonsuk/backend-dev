const express = require('express');
const {
    getAllBootcamps,
    getSingleBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    uploadPhoto,
} = require('../controllers/bootcamps');

const { protect, authorize } = require('../middleware/auth');

const Bootcamp = require('../models/Bootcamps');
const advancedQuery = require('../middleware/advancedQuery');

// Bring in other resourse routers
const courseRouter = require('./courses');
const reviewRouter = require('./review');

const router = express.Router();

// Re-route into other resource routers
// Anything that goes through /:id/courses will forward to courseRouter
router.use('/:id/courses', courseRouter);
router.use('/:id/reviews', reviewRouter);

// Upload photo
router.route('/:id/photo').put(uploadPhoto);

// Get bootcamps within radius of zipcode
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// @ api/v1/bootcamps
router
    .route('/')
    .get(advancedQuery(Bootcamp, 'courses'), getAllBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

// @ api/v1/bootcamps/:id
router
    .route('/:id')
    .get(getSingleBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
