const express = require('express');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { upload } = require('../middleware/upload');
const {
	registerValidators, updateValidators, registerCompany, getProfile, updateProfile, uploadLogo, uploadBanner, editLogo, editBanner,
} = require('../controllers/companyController');

const router = express.Router();

// Production routes - no test endpoints
router.post('/register', auth, registerValidators, validate, registerCompany);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateValidators, validate, updateProfile);
router.post('/upload-logo', auth, upload.single('logo'), uploadLogo);
router.post('/upload-banner', auth, upload.single('banner'), uploadBanner);
router.put('/edit-logo', auth, upload.single('logo'), editLogo);
router.put('/edit-banner', auth, upload.single('banner'), editBanner);

module.exports = router;