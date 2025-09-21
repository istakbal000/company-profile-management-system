const { validationResult } = require('express-validator');
const createError = require('http-errors');

const validate = (req, res, next) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		// Log detailed validation errors for debugging
		console.error('=== VALIDATION FAILED ===');
		console.error('Request body:', JSON.stringify(req.body, null, 2));
		console.error('Validation errors:', result.array());
		console.error('========================');
		
		// Return detailed validation errors
		return next(createError(400, 'Validation failed', { 
			details: result.array(),
			fields: result.array().map(error => `${error.param}: ${error.msg}`)
		}));
	}
	return next();
};

module.exports = { validate };


