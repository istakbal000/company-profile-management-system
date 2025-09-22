const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const { errorHandler, notFoundHandler } = require('./src/utils/error');
const logger = require('./src/utils/logger');
const authRoutes = require('./src/routes/auth');
const companyRoutes = require('./src/routes/company');
const { pool } = require('./src/config/db');
const { CLOUDINARY } = require('./src/config/env');

// Validate environment configuration at startup
function validateEnvironment() {
	const cloudinaryConfig = {
		CLOUD_NAME: CLOUDINARY.CLOUD_NAME,
		API_KEY: CLOUDINARY.API_KEY,
		API_SECRET: CLOUDINARY.API_SECRET,
		FOLDER: CLOUDINARY.FOLDER
	};
	
	if (!cloudinaryConfig.CLOUD_NAME || !cloudinaryConfig.API_KEY || !cloudinaryConfig.API_SECRET) {
		logger.error('CRITICAL: Cloudinary configuration is incomplete!');
		logger.error('Please ensure these environment variables are set: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
		process.exit(1);
	}
}

validateEnvironment();

const app = express();

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "https:"],
		},
	},
}));

const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
	credentials: true,
	optionsSuccessStatus: 200,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(compression());
// app.use(generalLimiter); // Temporarily disabled for testing

// Request logging middleware
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.path}`, {
		ip: req.ip,
		userAgent: req.get('User-Agent'),
		timestamp: new Date().toISOString()
	});
	next();
});

app.get('/', (req, res) => {
	res.json({
		message: 'Backend server is running. Please use the API endpoints.',
	});
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);

app.use(notFoundHandler);

// Enhanced error handler to log validation details
app.use((err, req, res, next) => {
	// Check for a validation error (e.g., from Joi or express-validator)
	if (err.isJoi || err.name === 'ValidationError' || Array.isArray(err.errors)) {
		logger.error('Validation Error:', {
			details: err.details || err.errors,
			path: req.path,
			body: req.body
		});
	}
	// Use the existing generic error handler
	errorHandler(err, req, res, next);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const start = async () => {
	try {
		// Enhanced database connection debugging
		console.log('🔄 Attempting database connection...');
		console.log('🔄 NODE_ENV:', process.env.NODE_ENV);
		console.log('🔄 DATABASE_URL exists:', !!process.env.DATABASE_URL);
		console.log('🔄 PORT:', PORT);
		
		// Verify DB connectivity before starting the server
		const result = await pool.query('SELECT 1 as connected, version() as pg_version');
		console.log('✅ Database connection test result:', result.rows[0]);
		logger.info('Database connection established');
		
		app.listen(PORT, () => {
			logger.info(`Server started on port ${PORT}`);
			console.log(`🚀 Server running on port ${PORT}`);
		});
	} catch (err) {
		console.error('❌ Database connection failed with details:');
		console.error('❌ Error code:', err.code);
		console.error('❌ Error message:', err.message);
		console.error('❌ Error stack:', err.stack);
		
		// Additional debugging for specific error types
		if (err.code === 'ECONNREFUSED') {
			console.error('🔍 ECONNREFUSED - Database server is not accessible');
			console.error('🔍 Check your DATABASE_URL and ensure the database service is running');
			console.error('🔍 Current DATABASE_URL format should be: postgresql://user:pass@host:port/db?sslmode=require');
		} else if (err.code === '28P01') {
			console.error('🔍 Authentication failed - Check username/password in DATABASE_URL');
		} else if (err.code === '3D000') {
			console.error('🔍 Database does not exist - Check database name in DATABASE_URL');
		}
		
		logger.error('Failed to connect to the database:', err);
		process.exit(1);
	}
};

start();
