const express = require('express');
const { register, signin } = require('../controllers/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/signin').post(signin);

module.exports = router;
