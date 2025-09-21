const logger = require('../utils/logger');
const { sendSuccess, sendError } = require('../utils/response');

describe('Security and Performance Improvements', () => {
	describe('Logger', () => {
		it('should be properly configured', () => {
			expect(logger).toBeDefined();
			expect(typeof logger.info).toBe('function');
			expect(typeof logger.error).toBe('function');
			expect(typeof logger.warn).toBe('function');
		});
	});

	describe('Response Utilities', () => {
		let mockRes;

		beforeEach(() => {
			mockRes = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn().mockReturnThis()
			};
		});

		it('should send success response correctly', () => {
			const data = { test: 'data' };
			sendSuccess(mockRes, data, 'Test success', 201);

			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				message: 'Test success',
				data: { test: 'data' }
			});
		});

		it('should send error response correctly', () => {
			sendError(mockRes, 'Test error', 400, ['validation error']);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				message: 'Test error',
				errors: ['validation error']
			});
		});
	});
});