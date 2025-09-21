import axios from 'axios'
import { handleError, withRetry, ERROR_TYPES } from '../utils/errorHandler'

// Dynamic API base URL for different environments
const getApiBaseUrl = () => {
  // For Vercel deployment, use relative paths to same domain
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  // For development, use the environment variable or default
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// Request interceptor to add auth token and request logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request ID for tracking
    config.metadata = { startTime: new Date() }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      const duration = new Date() - response.config.metadata.startTime
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`)
    }
    return response
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 'unknown'
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, error)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', {
    ...userData,
    signup_type: 'e' // Required by backend validation
  }),
  login: (credentials) => api.post('/api/auth/login', credentials),
  verifyEmail: (userId) => api.get(`/api/auth/verify-email?user_id=${userId}`),
  verifyMobile: (data) => api.post('/api/auth/verify-mobile', data),
}

// Company API
export const companyAPI = {
  register: (companyData) => api.post('/api/company/register', companyData),
  getProfile: () => api.get('/api/company/profile'),
  updateProfile: (updates) => api.put('/api/company/profile', updates),
  uploadLogo: (file) => {
    console.log('API: Creating FormData for logo upload:', file.name);
    const formData = new FormData()
    formData.append('logo', file)
    console.log('API: FormData created, making POST request to /api/company/upload-logo');
    return api.post('/api/company/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  uploadBanner: (file) => {
    const formData = new FormData()
    formData.append('banner', file)
    return api.post('/api/company/upload-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  editLogo: (file) => {
    console.log('API: Creating FormData for logo edit:', file ? file.name : 'null (delete)');
    const formData = new FormData()
    if (file) {
      formData.append('logo', file)
    }
    console.log('API: FormData created, making PUT request to /api/company/edit-logo');
    return api.put('/api/company/edit-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  editBanner: (file) => {
    console.log('API: Creating FormData for banner edit:', file ? file.name : 'null (delete)');
    const formData = new FormData()
    if (file) {
      formData.append('banner', file)
    }
    console.log('API: FormData created, making PUT request to /api/company/edit-banner');
    return api.put('/api/company/edit-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default api