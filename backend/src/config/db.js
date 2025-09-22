const { Pool } = require('pg');
const { PG } = require('./env');

// Configuration for both local development and production deployment
let poolConfig;

if (process.env.DATABASE_URL) {
	// Use DATABASE_URL (for Render or other cloud deployments)
	poolConfig = {
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.DATABASE_URL.includes('sslmode=disable') ? false : {
			rejectUnauthorized: false
		},
		max: 10,
		idleTimeoutMillis: 30000,
	};
} else {
	// Use individual environment variables (local development fallback)
	poolConfig = {
		host: PG.HOST,
		port: PG.PORT,
		user: PG.USER,
		password: PG.PASSWORD,
		database: PG.DATABASE,
		ssl: PG.SSL ? { rejectUnauthorized: false } : false,
		max: 10,
		idleTimeoutMillis: 30000,
	};
}

const pool = new Pool(poolConfig);

module.exports = { pool };


