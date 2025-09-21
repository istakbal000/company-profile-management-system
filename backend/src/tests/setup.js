// Set test environment
process.env.NODE_ENV = 'test';

// Mock Firebase and other external services
jest.mock('../services/firebaseService', () => ({
	createFirebaseUserWithEmail: jest.fn().mockResolvedValue({})
}));

jest.mock('../services/cloudinaryService', () => ({
	uploadImage: jest.fn().mockResolvedValue({ url: 'http://test-image.com' })
}));