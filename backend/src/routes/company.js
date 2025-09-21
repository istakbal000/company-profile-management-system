const express = require('express');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { upload } = require('../middleware/upload');
const {
	registerValidators, updateValidators, registerCompany, getProfile, updateProfile, uploadLogo, uploadBanner, editLogo, editBanner,
} = require('../controllers/companyController');
const { uploadImage } = require('../services/cloudinaryService');

const router = express.Router();

// Test endpoint for Cloudinary connectivity
router.post('/test-cloudinary', auth, async (req, res) => {
	try {
		// Test with a placeholder image URL
		const testUrl = 'https://via.placeholder.com/300x200/4f46e5/ffffff?text=Test+Image';
		const result = await uploadImage(testUrl, 'test-uploads', false);
		res.json({ 
			success: true, 
			message: 'Cloudinary connection successful',
			data: result 
		});
	} catch (error) {
		res.status(500).json({ 
			success: false, 
			message: 'Cloudinary connection failed',
			error: error.message 
		});
	}
});

router.post('/register', auth, registerValidators, validate, registerCompany);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateValidators, validate, updateProfile);
router.post('/upload-logo', auth, upload.single('logo'), uploadLogo);
router.post('/upload-banner', auth, upload.single('banner'), uploadBanner);
router.put('/edit-logo', auth, upload.single('logo'), editLogo);
router.put('/edit-banner', auth, upload.single('banner'), editBanner);

module.exports = router;


