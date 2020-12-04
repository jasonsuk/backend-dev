const express = require('express');

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
    .post(addCourse);
router
    .route('/:id')
    .get(getSingleCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;
