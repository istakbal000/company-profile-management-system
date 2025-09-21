const { cloudinary } = require('../config/cloudinary');
const { CLOUDINARY } = require('../config/env');
const streamifier = require('streamifier');

const uploadImage = async (source, folder = CLOUDINARY.FOLDER, isBuffer = false) => {
	try {
		console.log('CloudinaryService: Starting upload', {
			folder,
			isBuffer,
			sourceType: isBuffer ? 'buffer' : 'url/path',
			bufferSize: isBuffer && source.buffer ? source.buffer.length : 'N/A'
		});
		
		// Validate Cloudinary configuration
		if (!CLOUDINARY.CLOUD_NAME || !CLOUDINARY.API_KEY || !CLOUDINARY.API_SECRET) {
			console.error('CloudinaryService: Configuration incomplete');
			throw new Error('Cloudinary configuration is incomplete. Please check your environment variables.');
		}
		
		// Validate input
		if (!source) {
			console.error('CloudinaryService: No source provided');
			throw new Error('No image source provided');
		}
		
		if (isBuffer && (!source || !source.buffer || !Buffer.isBuffer(source.buffer))) {
			console.error('CloudinaryService: Invalid buffer provided', {
				hasSource: !!source,
				hasBuffer: !!source?.buffer,
				isBuffer: source?.buffer ? Buffer.isBuffer(source.buffer) : false
			});
			throw new Error('Invalid buffer provided for image upload');
		}
		
		if (isBuffer) {
			// Handle file buffer upload using a stream
			console.log('CloudinaryService: Uploading buffer via stream');
			return new Promise((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{
						folder,
						resource_type: 'image',
						overwrite: true,
						transformation: [{ quality: 'auto', fetch_format: 'auto' }],
					},
					(error, result) => {
						if (error) {
							console.error('CloudinaryService: Upload stream error:', error);
							return reject(error);
						}
						console.log('CloudinaryService: Upload successful', {
							url: result.secure_url,
							public_id: result.public_id
						});
						resolve({ url: result.secure_url, public_id: result.public_id });
					}
				);
				
				// Pipe the buffer to the upload stream
				streamifier.createReadStream(source.buffer).pipe(uploadStream);
			});
		} else {
			// Handle file path or URL upload
			console.log('CloudinaryService: Uploading from path/URL');
			const res = await cloudinary.uploader.upload(source, {
				folder,
				resource_type: 'image',
				overwrite: true,
				transformation: [{ quality: 'auto', fetch_format: 'auto' }],
			});
			
			console.log('CloudinaryService: Upload successful', {
				url: res.secure_url,
				public_id: res.public_id
			});
			
			return { url: res.secure_url, public_id: res.public_id };
		}
	} catch (error) {
		console.error('CloudinaryService: Upload failed', {
			errorMessage: error.message,
			errorCode: error.http_code,
			errorStack: error.stack
		});
		
		// Provide specific error messages
		let errorMessage = 'Image upload failed';
		if (error.message) {
			errorMessage += `: ${error.message}`;
		} else if (error.http_code) {
			errorMessage += `: HTTP ${error.http_code}`;
		} else {
			errorMessage += ': Unknown error occurred';
		}
		
		throw new Error(errorMessage);
	}
};

module.exports = { uploadImage };