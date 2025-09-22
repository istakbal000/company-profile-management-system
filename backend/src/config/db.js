const { Pool } = require('pg');
const { PG } = require('./env');

// Configuration for Render deployment
let poolConfig;

if (process.env.DATABASE_URL) {
	// Production environment (Render) - use DATABASE_URL
	poolConfig = {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false
		},
		max: 10,
		idleTimeoutMillis: 30000,
	};
} else {
	// Local development environment
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


