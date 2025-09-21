const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const { errorHandler } = require('../utils/error');

// Mock the database and external services
jest.mock('../models/users', () => ({
	getUserByEmail: jest.fn(),
	createUser: jest.fn(),
	setEmailVerified: jest.fn(),
	setMobileVerified: jest.fn()
}));

jest.mock('../services/firebaseService', () => ({
	createFirebaseUserWithEmail: jest.fn()
}));

jest.mock('../middleware/validate', () => ({
	validate: (req, res, next) => next()
}));

const { getUserByEmail, createUser } = require('../models/users');
const { createFirebaseUserWithEmail } = require('../services/firebaseService');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Authentication Endpoints', () => {
	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks();
	});

	describe('POST /api/auth/register', () => {
		it('should register a new user successfully', async () => {
			// Mock that user doesn't exist
			getUserByEmail.mockResolvedValue(null);
			createUser.mockResolvedValue({ id: 1, email: 'test@example.com' });

			const userData = {
				email: 'test@example.com',
				password: 'TestPass123!',
				full_name: 'Test User',
				gender: 'm',
				mobile_no: '+1234567890'
			};

			const response = await request(app)
				.post('/api/auth/register')
				.send(userData)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('User registered successfully. Please verify mobile OTP.');
			expect(response.body.data).toHaveProperty('user_id');
		});

		it('should return 400 for duplicate email', async () => {
			// Mock that user already exists
			getUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

			const userData = {
				email: 'test@example.com',
				password: 'TestPass123!',
				full_name: 'Test User 2',
				gender: 'f',
				mobile_no: '+1234567891'
			};

			const response = await request(app)
				.post('/api/auth/register')
				.send(userData)
				.expect(400);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('Email already registered');
		});

		it('should return 400 for invalid email', async () => {
			const userData = {
				email: 'invalid-email',
				password: 'TestPass123!',
				full_name: 'Test User',
				gender: 'm',
				mobile_no: '+1234567890'
			};

			const response = await request(app)
				.post('/api/auth/register')
				.send(userData)
				.expect(400);

			expect(response.body.success).toBe(false);
		});
	});

	describe('POST /api/auth/login', () => {
		it('should login successfully with valid credentials', async () => {
			// Mock user exists with correct password
			const bcrypt = require('bcrypt');
			const hashedPassword = await bcrypt.hash('TestPass123!', 10);
			getUserByEmail.mockResolvedValue({
				id: 1,
				email: 'test@example.com',
				password: hashedPassword
			});

			const loginData = {
				email: 'test@example.com',
				password: 'TestPass123!'
			};

			const response = await request(app)
				.post('/api/auth/login')
				.send(loginData)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('Login successful');
			expect(response.body.data).toHaveProperty('token');
		});

		it('should return 401 for invalid credentials', async () => {
			// Mock user doesn't exist
			getUserByEmail.mockResolvedValue(null);

			const loginData = {
				email: 'test@example.com',
				password: 'wrongpassword'
			};

			const response = await request(app)
				.post('/api/auth/login')
				.send(loginData)
				.expect(401);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('Invalid credentials');
		});
	});
});