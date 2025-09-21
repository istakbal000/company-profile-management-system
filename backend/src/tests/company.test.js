const request = require('supertest');
const express = require('express');
const companyRoutes = require('../routes/company');
const { errorHandler } = require('../utils/error');
const { sign } = require('../utils/jwt');

// Mock the database and external services
jest.mock('../models/company', () => ({
	createCompany: jest.fn(),
	getCompanyByOwner: jest.fn(),
	updateCompanyByOwner: jest.fn()
}));

const { createCompany, getCompanyByOwner } = require('../models/company');

const app = express();
app.use(express.json());
app.use('/api/company', companyRoutes);
app.use(errorHandler);

describe('Company Endpoints', () => {
	let authToken;
	let userId = 1; // Mock user ID

	beforeAll(async () => {
		// Create a test token
		authToken = sign({ id: userId, email: 'test@example.com' });
	});

	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks();
	});

	describe('POST /api/company/register', () => {
		it('should create a company successfully', async () => {
			// Mock that no company exists for user
			getCompanyByOwner.mockResolvedValue(null);
			createCompany.mockResolvedValue({
				id: 1,
				company_name: 'Test Company',
				owner_id: userId
			});

			const companyData = {
				company_name: 'Test Company',
				address: '123 Test Street',
				city: 'Test City',
				state: 'Test State',
				country: 'Test Country',
				postal_code: '12345',
				industry: 'Technology'
			};

			const response = await request(app)
				.post('/api/company/register')
				.set('Authorization', `Bearer ${authToken}`)
				.send(companyData)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('Company created');
			expect(response.body.data).toHaveProperty('id');
		});

		it('should return 401 without authorization', async () => {
			const companyData = {
				company_name: 'Test Company',
				address: '123 Test Street',
				city: 'Test City',
				state: 'Test State',
				country: 'Test Country',
				postal_code: '12345',
				industry: 'Technology'
			};

			const response = await request(app)
				.post('/api/company/register')
				.send(companyData)
				.expect(401);

			expect(response.body.success).toBe(false);
		});
	});
});