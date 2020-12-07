const express = require('express');
const { register, signin, whoisme } = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/signin').post(signin);
router.route('/whoisme').get(protect, whoisme); // gets req.user from protect middleware

module.exports = router;
