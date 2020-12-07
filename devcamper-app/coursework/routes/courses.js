const express = require('express');

const { protect, authorize } = require('../middleware/auth');

const Course = require('../models/Courses');
const advancedQuery = require('../middleware/advancedQuery');

const {
    getCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse,
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        advancedQuery(Course, {
            path: 'bootcamp',
            select: 'name description',
        }),
        getCourses
    )
    .post(protect, authorize('publisher', 'admin'), addCourse);
router
    .route('/:id')
    .get(getSingleCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
