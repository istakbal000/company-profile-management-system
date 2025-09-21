const express = require('express');
const { validate } = require('../middleware/validate');
const {
	registerValidators, loginValidators, verifyMobileValidators,
	register, login, verifyEmail, verifyMobile,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidators, validate, register);
router.post('/login', loginValidators, validate, login);
router.get('/verify-email', verifyEmail);
router.post('/verify-mobile', verifyMobileValidators, validate, verifyMobile);

module.exports = router;


