const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const required = (key, fallback) => {
	if (fallback !== undefined) return process.env[key] ?? fallback;
	// In production, some variables might be provided via DATABASE_URL instead
	if (!process.env[key] && !process.env.DATABASE_URL) {
		console.error(`❌ CRITICAL: Missing required environment variable: ${key}`);
		console.error(`Please add ${key} to your .env file or ensure DATABASE_URL is provided`);
		throw new Error(`Missing env: ${key}`);
	}
	return process.env[key];
};

module.exports = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 3000,

	PG: {
		HOST: process.env.DATABASE_URL ? null : required('PGHOST', 'localhost'),
		PORT: process.env.DATABASE_URL ? null : parseInt(required('PGPORT', '5432'), 10),
		USER: process.env.DATABASE_URL ? null : required('PGUSER', 'postgres'),
		PASSWORD: process.env.DATABASE_URL ? null : required('PGPASSWORD', 'postgres'),
		DATABASE: process.env.DATABASE_URL ? null : required('PGDATABASE', 'company_db'),
		SSL: process.env.PGSSLMODE === 'require' || process.env.NODE_ENV === 'production',
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


