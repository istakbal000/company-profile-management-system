module.exports = {
	testEnvironment: 'node',
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	testMatch: ['**/src/tests/**/*.test.js'],
	setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
	collectCoverageFrom: [
		'src/**/*.js',
		'!src/tests/**',
		'!src/config/**',
		'!src/database/migrations/**'
	],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50
		}
	}
};