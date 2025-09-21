const { pool } = require('../config/db');

const createCompany = async (owner_id, payload) => {
	const {
		company_name, address, city, state, country, postal_code,
		website = null, logo_url = null, banner_url = null,
		industry, founded_date = null, description = null, social_links = null,
		company_size = null, email = null, phone = null, mission = null, vision = null, founding_story = null,
	} = payload;

	const { rows } = await pool.query(
		`INSERT INTO company_profile
		  (owner_id, company_name, address, city, state, country, postal_code, website, logo_url, banner_url, industry, founded_date, description, social_links, company_size, email, phone, mission, vision, founding_story)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
		 RETURNING *`,
		[owner_id, company_name, address, city, state, country, postal_code, website, logo_url, banner_url, industry, founded_date, description, social_links, company_size, email, phone, mission, vision, founding_story]
	);
	return rows[0];
};

const getCompanyByOwner = async (owner_id) => {
	const { rows } = await pool.query(`SELECT * FROM company_profile WHERE owner_id = $1`, [owner_id]);
	return rows[0];
};

const updateCompanyByOwner = async (owner_id, updates) => {
	const keys = Object.keys(updates);
	if (keys.length === 0) return getCompanyByOwner(owner_id);

	console.log('Database: Updating company with updates:', updates);
	console.log('Database: Update keys:', keys);
	
	const setFragments = keys.map((k, i) => `${k} = $${i + 2}`);
	const values = [owner_id, ...keys.map((k) => updates[k])];

	console.log('Database: SQL fragments:', setFragments);
	console.log('Database: SQL values:', values);

	const { rows } = await pool.query(
		`UPDATE company_profile SET ${setFragments.join(', ')}, updated_at = NOW() WHERE owner_id = $1 RETURNING *`,
		values
	);
	
	console.log('Database: Update result:', rows[0]);
	return rows[0];
};

module.exports = { createCompany, getCompanyByOwner, updateCompanyByOwner };


