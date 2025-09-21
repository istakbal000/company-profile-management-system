const createError = require('http-errors');

const notFoundHandler = (req, res, next) => {
	next(createError(404, 'Route not found'));
};

const errorHandler = (err, req, res, next) => {
	const status = err.status || err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	const details = err.details || undefined;

	if (process.env.NODE_ENV !== 'test') {
		// Log the full error for debugging
		console.error('Error details:', {
			message: err.message,
			stack: err.stack,
			path: req.path,
			method: req.method,
			body: req.body,
			file: req.file ? { fieldname: req.file.fieldname, mimetype: req.file.mimetype, size: req.file.size } : 'none'
		});
	}

	res.status(status).json({ success: false, message, details });
};

module.exports = { errorHandler, notFoundHandler };


