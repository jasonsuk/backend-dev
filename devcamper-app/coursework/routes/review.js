const express = require('express');
const router = express.Router({ mergeParams: true });

// Import middlewares
const { protect, authorize } = require('../middleware/auth');
const advancedQuery = require('../middleware/advancedQuery');

// Import review controller
const {
    getReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview,
} = require('../controllers/review');

// Import models
const Review = require('../models/Review');

// Routes
router
    .route('/')
    .get(
        advancedQuery(Review, {
            path: 'bootcamp',
            select: 'name description',
        }),
        getReviews
    )
    .post(protect, authorize('user', 'admin'), createReview);

router
    .route('/:id')
    .get(getSingleReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
