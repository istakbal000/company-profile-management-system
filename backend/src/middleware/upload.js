const multer = require('multer');
const createError = require('http-errors');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(createError(400, 'Only image files are allowed'), false);
	}
};

// Configure multer
const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
});

module.exports = { upload };