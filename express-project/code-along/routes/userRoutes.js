const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getSingleUser,
    addUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.export = router;
