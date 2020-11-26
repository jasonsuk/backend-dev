const express = require('express');
const {
    getAllBootcamps,
    getSingleBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
} = require('../controllers/bootcamps');

const router = express.Router();

// @ api/v1/bootcamps
router.route('/').get(getAllBootcamps).post(createBootcamp);

// @ api/v1/bootcamps/:id
router
    .route('/:id')
    .get(getSingleBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
