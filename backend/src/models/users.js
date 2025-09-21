const { pool } = require('../config/db');

const createUser = async ({ email, passwordHash, full_name, gender, mobile_no, signup_type }) => {
	const { rows } = await pool.query(
		`INSERT INTO users (email, password, full_name, gender, mobile_no, signup_type)
		 VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, email, full_name, gender, mobile_no, is_email_verified, is_mobile_verified, created_at, updated_at`,
		[email, passwordHash, full_name, gender, mobile_no, signup_type]
	);
	return rows[0];
};

const getUserByEmail = async (email) => {
	const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
	return rows[0];
};

const setEmailVerified = async (userId, value = true) => {
	await pool.query(`UPDATE users SET is_email_verified = $1, updated_at = NOW() WHERE id = $2`, [value, userId]);
};

const setMobileVerified = async (userId, value = true) => {
	await pool.query(`UPDATE users SET is_mobile_verified = $1, updated_at = NOW() WHERE id = $2`, [value, userId]);
};

module.exports = { createUser, getUserByEmail, setEmailVerified, setMobileVerified };


