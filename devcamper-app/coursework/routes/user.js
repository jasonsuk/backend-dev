const express = require('express');
const router = express.Router({ mergeParams: true });

const User = require('../models/User');

const advancedQuery = require('../middleware/advancedQuery');
const { protect, authorize } = require('../middleware/auth');

const {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/user');

// Global route
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedQuery(User), getAllUsers).post(createUser);

router.route('/:userid').get(getSingleUser).put(updateUser).delete(deleteUser);

module.exports = router;
