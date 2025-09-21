const createError = require('http-errors');
const { body } = require('express-validator');
const { sanitize } = require('../utils/sanitize');
const { createCompany, getCompanyByOwner, updateCompanyByOwner } = require('../models/company');
const { uploadImage } = require('../services/cloudinaryService');

const registerValidators = [
	body('company_name').isString().isLength({ min: 2 }),
	body('address').isString().isLength({ min: 3 }),
	body('city').isString().isLength({ min: 2 }),
	body('state').isString().isLength({ min: 2 }),
	body('country').isString().isLength({ min: 2 }),
	body('postal_code').isString().isLength({ min: 3 }),
	body('industry').isString().isLength({ min: 2 }),
];

// Flexible validators for profile updates - only validate provided fields
const updateValidators = [
	body('company_name').optional().isString().isLength({ min: 2 }).withMessage('Company name must be at least 2 characters'),
	body('address').optional().isString().isLength({ min: 3 }).withMessage('Address must be at least 3 characters'),
	body('city').optional().isString().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
	body('state').optional().isString().isLength({ min: 2 }).withMessage('State must be at least 2 characters'),
	body('country').optional().isString().isLength({ min: 2 }).withMessage('Country must be at least 2 characters'),
	body('postal_code').optional().isString().isLength({ min: 3 }).withMessage('Postal code must be at least 3 characters'),
	body('industry').optional().isString().isLength({ min: 2 }).withMessage('Industry must be at least 2 characters'),
	body('website').optional().custom((value) => {
		if (value && value.trim() !== '') {
			// Allow localhost URLs and standard URLs
			if (!/^https?:\/\/(localhost(:\d+)?|.+\..+)/.test(value)) {
				throw new Error('Website must be a valid URL');
			}
		}
		return true;
	}),
	body('description').optional().isString().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
	body('founded_date').optional().custom((value) => {
		if (value && value.trim() !== '') {
			if (!Date.parse(value)) {
				throw new Error('Founded date must be a valid date');
			}
		}
		return true;
	}),
	body('social_links').optional().isObject().withMessage('Social links must be an object'),
	body('company_size').optional().isString().withMessage('Company size must be a string'),
	body('email').optional().isEmail().withMessage('Email must be valid'),
	body('phone').optional().isString().withMessage('Phone must be a string'),
	body('mission').optional().isString().isLength({ max: 1000 }).withMessage('Mission must be less than 1000 characters'),
	body('vision').optional().isString().isLength({ max: 1000 }).withMessage('Vision must be less than 1000 characters'),
	body('founding_story').optional().isString().isLength({ max: 2000 }).withMessage('Founding story must be less than 2000 characters'),
];

const registerCompany = async (req, res, next) => {
	try {
		const owner_id = req.user.id;
		const payload = Object.fromEntries(
			Object.entries(req.body).map(([k, v]) => [k, typeof v === 'string' ? sanitize(v) : v])
		);
		
		// Auto-populate email with user's email if not provided
		if (!payload.email || payload.email.trim() === '') {
			payload.email = req.user.email;
		}

		const existing = await getCompanyByOwner(owner_id);
		if (existing) throw createError(400, 'Company already exists for this user');

		const company = await createCompany(owner_id, payload);

		res.status(201).json({ success: true, message: 'Company created', data: company });
	} catch (e) {
		next(e);
	}
};

const getProfile = async (req, res, next) => {
	try {
		const company = await getCompanyByOwner(req.user.id);
		
		// If company exists but doesn't have an email, populate with user's email
		if (company && (!company.email || company.email.trim() === '')) {
			// Get user's email from the request (added by auth middleware)
			company.email = req.user.email;
		}
		
		res.json({ success: true, data: company || null });
	} catch (e) {
		next(e);
	}
};

const updateProfile = async (req, res, next) => {
	try {
		// Filter out empty strings and null values, and sanitize strings
		const updates = {};
		Object.entries(req.body).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				if (typeof value === 'string' && value.trim() !== '') {
					updates[key] = sanitize(value.trim());
				} else if (typeof value === 'object' && !Array.isArray(value)) {
					// Handle social_links object: sanitize its inner values
					if (key === 'social_links') {
						const sanitizedLinks = {};
						Object.entries(value).forEach(([platform, link]) => {
							if (typeof link === 'string' && link.trim() !== '') {
								sanitizedLinks[platform] = sanitize(link.trim());
							} else if (typeof link === 'string') {
								// Include empty strings for social links to allow clearing them
								sanitizedLinks[platform] = '';
							}
						});
						updates[key] = sanitizedLinks;
					} else {
						updates[key] = value;
					}
				} else if (typeof value !== 'string') {
					updates[key] = value;
				}
			}
		});
		
		
		// Check if company exists first
		const existingCompany = await getCompanyByOwner(req.user.id);
		if (!existingCompany) {
			return res.status(404).json({ 
				success: false, 
				message: 'Company profile not found. Please create a profile first.' 
			});
		}
		
		const company = await updateCompanyByOwner(req.user.id, updates);

		res.json({ success: true, message: 'Company updated', data: company });
	} catch (e) {
		next(e);
	}
};

const uploadLogo = async (req, res, next) => {
	try {
		console.log('Controller: uploadLogo called', {
			hasFile: !!req.file,
			hasFilePath: !!req.body.filePath,
			fileDetails: req.file ? {
				originalname: req.file.originalname,
				mimetype: req.file.mimetype,
				size: req.file.size
			} : null
		});
		
		if (req.file) {
			// File upload via multipart/form-data
			const { url } = await uploadImage(req.file, 'company-module/logos', true);
			// Check if company exists, if not create a basic one first
			let company = await getCompanyByOwner(req.user.id);
			if (!company) {
				// Create minimal company profile if it doesn't exist
				company = await createCompany(req.user.id, {
					company_name: 'My Company',
					address: 'TBD',
					city: 'TBD',
					state: 'TBD',
					country: 'TBD',
					postal_code: '00000',
					industry: 'Technology',
					email: req.user.email // Auto-populate with user's email
				});
			}
			// Update company with logo URL
			company = await updateCompanyByOwner(req.user.id, { logo_url: url });
			return res.json({ success: true, message: 'Logo uploaded', data: { url, company } });
		} else if (req.body.filePath) {
			// URL/path upload via JSON
			const { url } = await uploadImage(req.body.filePath, 'company-module/logos', false);
			// Check if company exists, if not create a basic one first
			let company = await getCompanyByOwner(req.user.id);
			if (!company) {
				company = await createCompany(req.user.id, {
					company_name: 'My Company',
					address: 'TBD',
					city: 'TBD',
					state: 'TBD',
					country: 'TBD',
					postal_code: '00000',
					industry: 'Technology',
					email: req.user.email // Auto-populate with user's email
				});
			}
			company = await updateCompanyByOwner(req.user.id, { logo_url: url });
			return res.json({ success: true, message: 'Logo uploaded', data: { url, company } });
		} else {
			console.error('Controller: No file or filePath provided');
			throw createError(400, 'Logo file or filePath required');
		}
	} catch (e) {
		console.error('Controller: uploadLogo error:', e);
		next(e);
	}
};

const uploadBanner = async (req, res, next) => {
	try {
		// Check if we have a file upload or filePath
		if (req.file) {
			// File upload via multipart/form-data
			const { url } = await uploadImage(req.file, 'company-module/banners', true);

			// Check if company exists, if not create a basic one first
			let company = await getCompanyByOwner(req.user.id);
			if (!company) {
				company = await createCompany(req.user.id, {
					company_name: 'My Company',
					address: 'TBD',
					city: 'TBD',
					state: 'TBD',
					country: 'TBD',
					postal_code: '00000',
					industry: 'Technology',
					email: req.user.email // Auto-populate with user's email
				});
			}

			company = await updateCompanyByOwner(req.user.id, { banner_url: url });

			return res.json({ success: true, message: 'Banner uploaded', data: { url, company } });
		} else if (req.body.filePath) {
			// URL/path upload via JSON
			const { url } = await uploadImage(req.body.filePath, 'company-module/banners', false);
			
			// Check if company exists, if not create a basic one first
			let company = await getCompanyByOwner(req.user.id);
			if (!company) {
				company = await createCompany(req.user.id, {
					company_name: 'My Company',
					address: 'TBD',
					city: 'TBD',
					state: 'TBD',
					country: 'TBD',
					postal_code: '00000',
					industry: 'Technology'
				});
			}

			company = await updateCompanyByOwner(req.user.id, { banner_url: url });
			return res.json({ success: true, message: 'Banner uploaded', data: { url, company } });
		} else {
			throw createError(400, 'Banner file or filePath required');
		}
	} catch (e) {
		next(e);
	}
};

// New edit functions
const editLogo = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).json({ success: false, message: 'No file uploaded' });
		}
		
		// Check if company exists
		let company = await getCompanyByOwner(req.user.id);
		if (!company) {
			return res.status(404).json({ success: false, message: 'Company profile not found. Please create a profile first.' });
		}
		
		// Upload new logo
		const { url } = await uploadImage(req.file, 'company-module/logos', true);
		
		// Update company with new logo
		company = await updateCompanyByOwner(req.user.id, { logo_url: url });
		
		return res.json({ 
			success: true, 
			message: 'Logo updated successfully', 
			data: { url, company } 
		});
	} catch (e) {
		next(e);
	}
};

const editBanner = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).json({ success: false, message: 'No file uploaded' });
		}
		
		// Check if company exists
		let company = await getCompanyByOwner(req.user.id);
		if (!company) {
			return res.status(404).json({ success: false, message: 'Company profile not found. Please create a profile first.' });
		}
		
		// Upload new banner
		const { url } = await uploadImage(req.file, 'company-module/banners', true);
		
		// Update company with new banner
		company = await updateCompanyByOwner(req.user.id, { banner_url: url });
		
		return res.json({ 
			success: true, 
			message: 'Banner updated successfully', 
			data: { url, company } 
		});
	} catch (e) {
		next(e);
	}
};

module.exports = {
	registerValidators,
	updateValidators,
	registerCompany,
	getProfile,
	updateProfile,
	uploadLogo,
	uploadBanner,
	editLogo,
	editBanner,
};