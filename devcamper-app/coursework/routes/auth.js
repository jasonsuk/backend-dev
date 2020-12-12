const express = require('express');
const {
    register,
    signin,
    whoisme,
    updateDetails,
    updatePassword,
    forgotPassword,
    resetPassword,
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/signin').post(signin);
router.route('/whoisme').get(protect, whoisme); // gets req.user from protect middleware
router.route('/updateuserdetails').put(protect, updateDetails);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);

module.exports = router;
