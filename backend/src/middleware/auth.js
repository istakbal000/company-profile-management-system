const createError = require('http-errors');
const { verify } = require('../utils/jwt');

const auth = (req, res, next) => {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) {
		console.log(`🔒 AUTH FAILED: No token for ${req.method} ${req.path}`);
		return next(createError(401, 'Missing Authorization token'));
	}

	try {
		const decoded = verify(token);
		req.user = decoded;
		return next();
	} catch {
		console.log(`🔒 AUTH FAILED: Invalid token for ${req.method} ${req.path}`);
		return next(createError(401, 'Invalid or expired token'));
	}
};

module.exports = { auth };


