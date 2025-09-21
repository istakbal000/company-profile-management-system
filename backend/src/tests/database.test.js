const fs = require('fs');
const path = require('path');

describe('Database Migrations', () => {
	describe('Migration Files', () => {
		it('should have migration files present', () => {
			const migrationsDir = path.join(__dirname, '../database/migrations');
			expect(fs.existsSync(migrationsDir)).toBe(true);

			const migrationFiles = fs.readdirSync(migrationsDir)
				.filter(file => file.endsWith('.sql'));

			expect(migrationFiles.length).toBeGreaterThan(0);
			expect(migrationFiles).toContain('001_create_users_table.sql');
			expect(migrationFiles).toContain('002_create_company_profile_table.sql');
		});

		it('should have proper SQL content in migration files', () => {
			const usersTablePath = path.join(__dirname, '../database/migrations/001_create_users_table.sql');
			const usersTableContent = fs.readFileSync(usersTablePath, 'utf8');

			expect(usersTableContent).toContain('CREATE TABLE IF NOT EXISTS users');
			expect(usersTableContent).toContain('id SERIAL PRIMARY KEY');
			expect(usersTableContent).toContain('CREATE INDEX');

			const companyTablePath = path.join(__dirname, '../database/migrations/002_create_company_profile_table.sql');
			const companyTableContent = fs.readFileSync(companyTablePath, 'utf8');

			expect(companyTableContent).toContain('CREATE TABLE IF NOT EXISTS company_profile');
			expect(companyTableContent).toContain('REFERENCES users(id)');
		});
	});

	describe('Migration Runner', () => {
		it('should have migration runner module', () => {
			const migratePath = path.join(__dirname, '../database/migrate.js');
			expect(fs.existsSync(migratePath)).toBe(true);

			const { runMigrations } = require('../database/migrate');
			expect(typeof runMigrations).toBe('function');
		});
	});
});