const { Pool } = require('pg');
const { PG } = require('./env');

const pool = new Pool({
	host: PG.HOST,
	port: PG.PORT,
	user: PG.USER,
	password: PG.PASSWORD,
	database: PG.DATABASE,
	ssl: PG.SSL ? { rejectUnauthorized: false } : false,
	max: 10,
	idleTimeoutMillis: 30000,
});

module.exports = { pool };


