const { Pool } = require('pg');
const { PG } = require('./env');

// Configuration for Render deployment
let poolConfig;

if (process.env.DATABASE_URL) {
	// Production environment (Render) - use DATABASE_URL
	console.log('🔧 Using DATABASE_URL for database connection');
	console.log('🔧 DATABASE_URL exists:', !!process.env.DATABASE_URL);
	console.log('🔧 Environment:', process.env.NODE_ENV);
	
	// For production (Render), always require SSL
	const isProduction = process.env.NODE_ENV === 'production';
	const sslConfig = isProduction ? {
		rejectUnauthorized: false // Render requires SSL but with self-signed certs
	} : {
		rejectUnauthorized: false // Local development with DATABASE_URL
	};
	
	poolConfig = {
		connectionString: process.env.DATABASE_URL,
		ssl: sslConfig,
		max: 10,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 10000,
	};
	
	// Override SSL if DATABASE_URL explicitly disables it (local development)
	if (process.env.DATABASE_URL.includes('sslmode=disable')) {
		poolConfig.ssl = false;
		console.log('🔧 SSL disabled for local development');
	} else {
		console.log('🔧 SSL enabled for production/secure connection');
	}
} else {
	// Local development environment
	console.log('🔧 Using individual PG variables for database connection');
	console.log('🔧 PG Host:', PG.HOST);
	console.log('🔧 PG Port:', PG.PORT);
	console.log('🔧 PG Database:', PG.DATABASE);
	
	poolConfig = {
		host: PG.HOST,
		port: PG.PORT,
		user: PG.USER,
		password: PG.PASSWORD,
		database: PG.DATABASE,
		ssl: PG.SSL ? { rejectUnauthorized: false } : false,
		max: 10,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 10000,
	};
}

const pool = new Pool(poolConfig);

// Add connection error handling
pool.on('error', (err) => {
	console.error('❌ PostgreSQL pool error:', err);
	console.error('❌ Error code:', err.code);
	console.error('❌ Error message:', err.message);
});

module.exports = { pool };


