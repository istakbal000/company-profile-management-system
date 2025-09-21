const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');
const logger = require('../utils/logger');

const createTables = async () => {
	try {
		console.log(' Running database migrations...');

		// Create users table
		await pool.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				email VARCHAR(255) UNIQUE NOT NULL,
				password VARCHAR(255) NOT NULL,
				full_name VARCHAR(255) NOT NULL,
				gender CHAR(1) CHECK (gender IN ('m', 'f', 'o')),
				mobile_no VARCHAR(20),
				signup_type CHAR(1) DEFAULT 'e',
				is_email_verified BOOLEAN DEFAULT FALSE,
				is_mobile_verified BOOLEAN DEFAULT FALSE,
				created_at TIMESTAMP DEFAULT NOW(),
				updated_at TIMESTAMP DEFAULT NOW()
			);
		`);

		// Create company_profile table
		await pool.query(`
			CREATE TABLE IF NOT EXISTS company_profile (
				id SERIAL PRIMARY KEY,
				owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
				company_name VARCHAR(255) NOT NULL,
				address TEXT,
				city VARCHAR(100),
				state VARCHAR(100),
				country VARCHAR(100),
				postal_code VARCHAR(20),
				website VARCHAR(255),
				logo_url TEXT,
				banner_url TEXT,
				industry VARCHAR(100),
				founded_date DATE,
				description TEXT,
				social_links JSONB,
				company_size VARCHAR(50),
				email VARCHAR(255),
				phone VARCHAR(20),
				mission TEXT,
				vision TEXT,
				founding_story TEXT,
				created_at TIMESTAMP DEFAULT NOW(),
				updated_at TIMESTAMP DEFAULT NOW()
			);
		`);

		console.log('Database migrations completed successfully');
	} catch (error) {
		console.error('Database migration failed:', error);
		throw error;
	}
};

const runMigrations = async () => {
	try {
		const migrationsDir = path.join(__dirname, 'migrations');
		const migrationFiles = fs.readdirSync(migrationsDir)
			.filter(file => file.endsWith('.sql'))
			.sort();

		logger.info(`Found ${migrationFiles.length} migration files`);

		for (const file of migrationFiles) {
			const filePath = path.join(migrationsDir, file);
			const sql = fs.readFileSync(filePath, 'utf8');
			
			logger.info(`Running migration: ${file}`);
			await pool.query(sql);
			logger.info(`Completed migration: ${file}`);
		}

		logger.info('All migrations completed successfully');
	} catch (error) {
		logger.error('Migration failed:', error);
		throw error;
	}
};

if (require.main === module) {
	createTables()
		.then(() => runMigrations())
		.then(() => {
			console.log('Migration script completed');
			process.exit(0);
		})
		.catch((error) => {
			console.error('Migration script failed:', error);
			process.exit(1);
		});
}

module.exports = { createTables, runMigrations };