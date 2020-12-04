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
const { route } = require('./courses');

const Bootcamp = require('../models/Bootcamps');
const advancedQuery = require('../middleware/advancedQuery');

// Bring in other resourse routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routers
// Anything that goes through /:id/courses will forward to courseRouter
router.use('/:id/courses', courseRouter);

// Upload photo
router.route('/:id/photo').put(uploadPhoto);

// Get bootcamps within radius of zipcode
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// @ api/v1/bootcamps
router
    .route('/')
    .get(advancedQuery(Bootcamp, 'courses'), getAllBootcamps)
    .post(createBootcamp);

// @ api/v1/bootcamps/:id
router
    .route('/:id')
    .get(getSingleBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
