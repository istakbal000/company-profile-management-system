const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const required = (key, fallback) => {
	if (fallback !== undefined) return process.env[key] ?? fallback;
	if (!process.env[key]) {
		console.error(`❌ CRITICAL: Missing required environment variable: ${key}`);
		console.error(`Please add ${key} to your .env file`);
		throw new Error(`Missing env: ${key}`);
	}
	return process.env[key];
};

module.exports = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 3000,

	PG: {
		HOST: required('PGHOST', 'localhost'),
		PORT: parseInt(required('PGPORT', '5432'), 10),
		USER: required('PGUSER', 'postgres'),
		PASSWORD: required('PGPASSWORD', 'postgres'),
		DATABASE: required('PGDATABASE', 'company_db'),
		SSL: process.env.PGSSLMODE === 'require',
	},

	JWT_SECRET: required('JWT_SECRET', 'dev_secret_change_me'),
	JWT_EXPIRES_IN: '90d',

	CLOUDINARY: {
		CLOUD_NAME: required('CLOUDINARY_CLOUD_NAME', ''),
		API_KEY: required('CLOUDINARY_API_KEY', ''),
		API_SECRET: required('CLOUDINARY_API_SECRET', ''),
		FOLDER: process.env.CLOUDINARY_FOLDER || 'company-module',
	},

	// Firebase Admin service account JSON path or JSON string
	FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT || '',
	FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
};


