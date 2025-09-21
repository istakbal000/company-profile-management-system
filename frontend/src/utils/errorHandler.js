import { toast } from 'react-toastify';

// Error types for better categorization
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Standardized error object structure
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Parse API error response and return standardized error
 */
export const parseApiError = (error) => {
  // Network errors (no response)
  if (!error.response) {
    if (error.request) {
      return new AppError(
        'Unable to connect to server. Please check your internet connection.',
        ERROR_TYPES.NETWORK,
        ERROR_SEVERITY.HIGH,
        error
      );
    }
    return new AppError(
      'An unexpected error occurred.',
      ERROR_TYPES.UNKNOWN,
      ERROR_SEVERITY.MEDIUM,
      error
    );
  }

  const { status, data } = error.response;
  const message = data?.message || data?.error || 'An error occurred';

  // Categorize by HTTP status code
  switch (status) {
    case 400:
      return new AppError(
        message,
        ERROR_TYPES.VALIDATION,
        ERROR_SEVERITY.LOW,
        error
      );
    case 401:
      return new AppError(
        'Please log in to continue.',
        ERROR_TYPES.AUTHENTICATION,
        ERROR_SEVERITY.MEDIUM,
        error
      );
    case 403:
      return new AppError(
        'You do not have permission to perform this action.',
        ERROR_TYPES.AUTHORIZATION,
        ERROR_SEVERITY.MEDIUM,
        error
      );
    case 404:
      return new AppError(
        'The requested resource was not found.',
        ERROR_TYPES.CLIENT,
        ERROR_SEVERITY.LOW,
        error
      );
    case 422:
      return new AppError(
        message,
        ERROR_TYPES.VALIDATION,
        ERROR_SEVERITY.LOW,
        error
      );
    case 429:
      return new AppError(
        'Too many requests. Please try again later.',
        ERROR_TYPES.CLIENT,
        ERROR_SEVERITY.MEDIUM,
        error
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return new AppError(
        'Server error. Please try again later.',
        ERROR_TYPES.SERVER,
        ERROR_SEVERITY.HIGH,
        error
      );
    default:
      return new AppError(
        message,
        ERROR_TYPES.UNKNOWN,
        ERROR_SEVERITY.MEDIUM,
        error
      );
  }
};

/**
 * Handle errors with appropriate user feedback
 */
export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    customMessage = null,
    onError = null
  } = options;

  let appError;
  
  if (error instanceof AppError) {
    appError = error;
  } else if (error.response || error.request) {
    appError = parseApiError(error);
  } else {
    appError = new AppError(
      error.message || 'An unexpected error occurred',
      ERROR_TYPES.UNKNOWN,
      ERROR_SEVERITY.MEDIUM,
      error
    );
  }

  // Log to console in development
  if (logToConsole && process.env.NODE_ENV === 'development') {
    console.group(`🚨 ${appError.type} - ${appError.severity.toUpperCase()}`);
    console.error('Message:', appError.message);
    console.error('Original Error:', appError.originalError);
    console.error('Timestamp:', appError.timestamp);
    console.groupEnd();
  }

  // Show toast notification
  if (showToast) {
    const message = customMessage || appError.message;
    
    switch (appError.severity) {
      case ERROR_SEVERITY.LOW:
        toast.info(message);
        break;
      case ERROR_SEVERITY.MEDIUM:
        toast.warning(message);
        break;
      case ERROR_SEVERITY.HIGH:
      case ERROR_SEVERITY.CRITICAL:
        toast.error(message);
        break;
      default:
        toast.error(message);
    }
  }

  // Execute custom error handler
  if (onError && typeof onError === 'function') {
    onError(appError);
  }

  return appError;
};

/**
 * Validation helper functions
 */
export const validators = {
  email: (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },

  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character';
    return null;
  },

  phone: (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return null;
  },

  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value, min, fieldName = 'This field') => {
    if (!value || value.length < min) {
      return `${fieldName} must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (value, max, fieldName = 'This field') => {
    if (value && value.length > max) {
      return `${fieldName} must be no more than ${max} characters long`;
    }
    return null;
  },

  url: (url) => {
    if (!url) return null; // URL is optional
    try {
      new URL(url);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  fileSize: (file, maxSizeInMB = 5) => {
    if (!file) return 'File is required';
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }
    return null;
  },

  fileType: (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']) => {
    if (!file) return 'File is required';
    if (!allowedTypes.includes(file.type)) {
      return `File type must be one of: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }
    return null;
  }
};

/**
 * Retry mechanism for failed operations
 */
export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

export default {
  AppError,
  ERROR_TYPES,
  ERROR_SEVERITY,
  parseApiError,
  handleError,
  validators,
  withRetry
};
