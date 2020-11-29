const express = require('express');
const {
    getAllBootcamps,
    getSingleBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
} = require('../controllers/bootcamps');

const router = express.Router();

// @ api/v1/bootcamps/radius/:zipcode/:distance
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// @ api/v1/bootcamps
router.route('/').get(getAllBootcamps).post(createBootcamp);

// @ api/v1/bootcamps/:id
router
    .route('/:id')
    .get(getSingleBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
