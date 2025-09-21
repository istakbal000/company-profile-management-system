const createError = require('http-errors');
 
// Lazy init to avoid crashing server on startup if Firebase env is not ready
let cachedAdmin = null;
const getAdmin = () => {
	if (cachedAdmin) return cachedAdmin;
	try {
		// eslint-disable-next-line global-require
		const { admin } = require('../config/firebase');
		cachedAdmin = admin;
		return cachedAdmin;
	} catch (e) {
		return null;
	}
};

const createFirebaseUserWithEmail = async ({ email, password, phoneNumber }) => {
	const admin = getAdmin();
	if (!admin) {
		// Fallback to allow local dev without Firebase; caller should handle real verification flow
		return { uid: `local_${Date.now()}`, email };
	}
	try {
		const user = await admin.auth().createUser({
			email,
			password,
			phoneNumber: phoneNumber || undefined,
			emailVerified: false,
			disabled: false,
		});
		return user;
	} catch (e) {
		throw createError(400, e.message);
	}
};

const verifyIdToken = async (idToken) => {
	const admin = getAdmin();
	if (!admin) throw createError(501, 'Firebase not configured');
	try {
		return await admin.auth().verifyIdToken(idToken);
	} catch (e) {
		throw createError(401, 'Invalid Firebase ID token');
	}
};

module.exports = { createFirebaseUserWithEmail, verifyIdToken };


