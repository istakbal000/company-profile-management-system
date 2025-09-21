const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const { errorHandler, notFoundHandler } = require('./src/utils/error');
const logger = require('./src/utils/logger');
const authRoutes = require('./src/routes/auth');

// Use production routes in production environment, regular routes otherwise
const companyRoutes = process.env.VERCEL_ENV === 'production' 
  ? require('./src/routes/company.prod') 
  : require('./src/routes/company');

// Validate environment variables for production
function validateProductionEnv() {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY', 
    'CLOUDINARY_API_SECRET',
    'JWT_SECRET',
    'PGHOST',
    'PGUSER',
    'PGPASSWORD',
    'PGDATABASE'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    if (process.env.VERCEL_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
}

// Only validate in production
if (process.env.VERCEL_ENV === 'production') {
  validateProductionEnv();
}

// Create Express app
const app = express();

// Middleware for Vercel deployment
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

// CORS configuration for production
const corsOptions = {
	origin: process.env.VERCEL_ENV === 'production' 
		? [process.env.FRONTEND_URL, 'https://*.vercel.app']
		: ['http://localhost:3000', 'http://localhost:5173'],
	credentials: true,
	optionsSuccessStatus: 200,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(compression());

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.VERCEL_ENV || 'development' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Export for Vercel
module.exports = app;