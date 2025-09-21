const admin = require('firebase-admin');
const { FIREBASE_SERVICE_ACCOUNT, FIREBASE_PROJECT_ID } = require('./env');

const serviceAccount = (() => {
	try {
		if (FIREBASE_SERVICE_ACCOUNT.trim().startsWith('{')) {
			return JSON.parse(FIREBASE_SERVICE_ACCOUNT);
		}
		// eslint-disable-next-line import/no-dynamic-require, global-require
		return require(FIREBASE_SERVICE_ACCOUNT);
	} catch (e) {
		throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT. Provide JSON string or path to JSON file.');
	}
})();

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		projectId: FIREBASE_PROJECT_ID,
	});
}

module.exports = { admin };


