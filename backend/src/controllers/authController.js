const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { body } = require('express-validator');
const { sanitize } = require('../utils/sanitize');
const { createUser, getUserByEmail, setEmailVerified, setMobileVerified } = require('../models/users');
const { sign } = require('../utils/jwt');
const { createFirebaseUserWithEmail } = require('../services/firebaseService');

const registerValidators = [
	body('email').isEmail(),
	body('password').isStrongPassword({ minLength: 8, minSymbols: 1 }),
	body('full_name').isLength({ min: 2 }),
	body('gender').isIn(['m', 'f', 'o']),
	body('mobile_no').isString().isLength({ min: 8, max: 20 }),
	body('signup_type').equals('e'),
];

const register = async (req, res, next) => {
	try {
		const email = sanitize(req.body.email);
		const password = req.body.password;
		const full_name = sanitize(req.body.full_name);
		const gender = req.body.gender;
		const mobile_no = sanitize(req.body.mobile_no);
		const signup_type = 'e';

		const exists = await getUserByEmail(email);
		if (exists) throw createError(400, 'Email already registered');

		await createFirebaseUserWithEmail({ email, password, phoneNumber: mobile_no.startsWith('+') ? mobile_no : undefined });

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await createUser({ email, passwordHash, full_name, gender, mobile_no, signup_type });

		res.status(201).json({
			success: true,
			message: 'User registered successfully. Please verify mobile OTP.',
			data: { user_id: user.id },
		});
	} catch (e) {
		next(e);
	}
};

const loginValidators = [
	body('email').isEmail(),
	body('password').isString().isLength({ min: 6 }),
];

const login = async (req, res, next) => {
	try {
		const email = sanitize(req.body.email);
		const password = req.body.password;

		const user = await getUserByEmail(email);
		if (!user) throw createError(401, 'Invalid credentials');

		const ok = await bcrypt.compare(password, user.password);
		if (!ok) throw createError(401, 'Invalid credentials');

		const token = sign({ id: user.id, email: user.email });
		
		// Return user data without password
		const userData = {
			id: user.id,
			email: user.email,
			firstName: user.full_name ? user.full_name.split(' ')[0] : '',
			lastName: user.full_name ? user.full_name.split(' ').slice(1).join(' ') : '',
			fullName: user.full_name,
			gender: user.gender,
			mobileNo: user.mobile_no
		};

		res.json({ 
			success: true, 
			message: 'Login successful', 
			data: { 
				token,
				user: userData
			} 
		});
	} catch (e) {
		next(e);
	}
};

const verifyEmail = async (req, res, next) => {
	try {
		const userId = parseInt(req.query.user_id, 10);
		if (!userId) return next(createError(400, 'user_id is required'));
		await setEmailVerified(userId, true);
		res.json({ success: true, message: 'Email verified' });
	} catch (e) {
		next(e);
	}
};

const verifyMobileValidators = [body('user_id').isInt(), body('otp').isString()];
const verifyMobile = async (req, res, next) => {
	try {
		await setMobileVerified(req.body.user_id, true);
		res.json({ success: true, message: 'Mobile verified' });
	} catch (e) {
		next(e);
	}
};

module.exports = {
	registerValidators,
	loginValidators,
	verifyMobileValidators,
	register,
	login,
	verifyEmail,
	verifyMobile,
};


