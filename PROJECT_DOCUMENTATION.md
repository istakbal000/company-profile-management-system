# HireNext Company Profile Management System

## 📋 Project Overview

**HireNext** is a comprehensive company profile management system that allows businesses to create, manage, and showcase their company information with professional image uploads and social media integration.

## 🏗️ System Architecture

### Frontend Architecture (React + Vite)
```
Frontend Stack:
├── React 18 (UI Framework)
├── Vite (Build Tool & Dev Server)
├── Material-UI (Component Library)
├── Redux Toolkit (State Management)
├── React Hook Form (Form Handling)
├── React Router (Navigation)
└── Axios (HTTP Client)
```

### Backend Architecture (Node.js + Express)
```
Backend Stack:
├── Node.js (Runtime Environment)
├── Express.js (Web Framework)
├── PostgreSQL (Database)
├── Cloudinary (Image Storage CDN)
├── JWT (Authentication)
├── Multer (File Upload Middleware)
└── Jest (Testing Framework)
```

## 🎯 Core Features

### 1. Multi-Step Company Registration System
- **Step 1: Company Information**
  - Company name, industry, size
  - Description and website URL
  - Logo upload with 1:1 aspect ratio
  - Banner upload with 16:9 aspect ratio

- **Step 2: Contact Information**
  - Business email and phone number
  - Complete address (street, city, state, zip, country)
  - Form validation with real-time feedback

- **Step 3: Founding Information**
  - Founded year selection
  - Mission and vision statements
  - Company founding story
  - Character limits and validation

- **Step 4: Social Media Integration**
  - LinkedIn company page
  - Twitter/X profile
  - Facebook business page
  - Instagram account
  - URL validation for all social links

### 2. Advanced Image Upload System

#### Image Upload Component Features
```javascript
// Key capabilities
- Drag & drop file upload
- Click to select files
- Real-time preview generation
- File type validation (JPEG, PNG, GIF, WebP)
- File size validation (configurable limits)
- Aspect ratio enforcement
- Error handling with user feedback
- Progress indicators during upload
```

#### Cloudinary Integration
- **CDN Delivery**: Global content delivery network
- **Image Optimization**: Automatic format and size optimization
- **Secure Upload**: Direct upload with signed URLs
- **Transformation**: On-the-fly image transformations
- **Storage Management**: Organized folder structure

### 3. Comprehensive Validation Framework

#### Frontend Validation
```javascript
// Validation utilities
const validators = {
  email: (email) => emailRegex.test(email) ? null : 'Invalid email address',
  phone: (phone) => phoneRegex.test(phone) ? null : 'Invalid phone number',
  url: (url) => isValidURL(url) ? null : 'Invalid URL format',
  required: (value, fieldName) => value ? null : `${fieldName} is required`,
  minLength: (value, min, fieldName) => 
    value.length >= min ? null : `${fieldName} must be at least ${min} characters`,
  maxLength: (value, max, fieldName) => 
    value.length <= max ? null : `${fieldName} must be no more than ${max} characters`,
  fileSize: (file, maxMB) => 
    file.size <= maxMB * 1024 * 1024 ? null : `File must be less than ${maxMB}MB`,
  fileType: (file, allowedTypes) => 
    allowedTypes.includes(file.type) ? null : 'Invalid file type'
}
```

#### Backend Validation
- **Input Sanitization**: XSS protection and data cleaning
- **Schema Validation**: Joi/Express-validator for request validation
- **File Upload Security**: MIME type verification, size limits
- **Database Constraints**: Foreign key relationships, unique constraints

## 📁 Detailed Project Structure

```
assignment/
├── frontend/                           # React Application
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                  # Authentication Components
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── common/                # Reusable Components
│   │   │   │   ├── ErrorBoundary.jsx  # Error handling wrapper
│   │   │   │   ├── FormValidation.jsx # Validation utilities
│   │   │   │   └── ImageUpload.jsx    # Drag & drop image upload
│   │   │   ├── company/               # Company Profile Components
│   │   │   │   ├── CompanyInfoStep.jsx    # Step 1: Basic info + images
│   │   │   │   ├── ContactStep.jsx        # Step 2: Contact details
│   │   │   │   ├── FoundingInfoStep.jsx   # Step 3: Company history
│   │   │   │   └── SocialMediaStep.jsx    # Step 4: Social profiles
│   │   │   └── layout/                # Layout Components
│   │   ├── pages/                     # Page Components
│   │   │   ├── auth/                  # Authentication Pages
│   │   │   ├── Dashboard.jsx          # Main dashboard
│   │   │   └── CompanySetup.jsx       # Multi-step form container
│   │   ├── services/                  # API Services
│   │   │   └── api.js                 # Axios configuration & endpoints
│   │   ├── store/                     # Redux Store
│   │   │   ├── index.js               # Store configuration
│   │   │   └── slices/                # Redux slices
│   │   │       ├── authSlice.js       # Authentication state
│   │   │       └── companySlice.js    # Company data state
│   │   ├── utils/                     # Utility Functions
│   │   │   └── errorHandler.js        # Comprehensive error handling
│   │   ├── App.jsx                    # Root component
│   │   └── main.jsx                   # Application entry point
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   └── .env                           # Environment variables
├── backend/                           # Node.js API Server
│   ├── src/
│   │   ├── config/                    # Configuration Files
│   │   │   ├── database.js            # PostgreSQL connection
│   │   │   └── cloudinary.js          # Cloudinary setup
│   │   ├── controllers/               # Route Controllers
│   │   │   ├── authController.js      # Authentication logic
│   │   │   └── companyController.js   # Company CRUD operations
│   │   ├── middleware/                # Custom Middleware
│   │   │   ├── auth.js                # JWT authentication
│   │   │   ├── upload.js              # Multer file upload
│   │   │   └── validation.js          # Request validation
│   │   ├── models/                    # Database Models
│   │   │   ├── User.js                # User model
│   │   │   └── Company.js             # Company model
│   │   ├── routes/                    # API Routes
│   │   │   ├── auth.js                # Authentication routes
│   │   │   └── company.js             # Company routes
│   │   ├── services/                  # Business Logic
│   │   │   └── cloudinaryService.js   # Image upload service
│   │   └── database/                  # Database Files
│   │       ├── migrations/            # Database migrations
│   │       └── seeders/               # Test data seeders
│   ├── tests/                         # Test Suites
│   │   ├── unit/                      # Unit tests
│   │   └── integration/               # Integration tests
│   ├── logs/                          # Application logs
│   ├── package.json                   # Backend dependencies
│   ├── server.js                      # Server entry point
│   ├── .env.example                   # Environment template
│   └── jest.config.js                 # Test configuration
├── netlify.toml                       # Netlify deployment config
├── .gitignore                         # Git ignore rules
└── PROJECT_DOCUMENTATION.md           # This documentation
```

## 🔧 Technical Implementation Details

### State Management (Redux Toolkit)

#### Company Slice
```javascript
// Company state structure
const companyState = {
  data: {
    // Basic Information
    company_name: '',
    industry: '',
    company_size: '',
    website: '',
    description: '',
    
    // Contact Information
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Founding Information
    foundedYear: '',
    foundingStory: '',
    mission: '',
    vision: '',
    
    // Social Media
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    
    // Images
    logo_url: '',
    banner_url: ''
  },
  loading: false,
  error: null
}
```

#### Async Thunks
```javascript
// Key async operations
- registerCompany()      // Create new company profile
- updateCompany()        // Update existing profile
- fetchCompany()         // Retrieve company data
- uploadCompanyLogo()    // Upload logo image
- uploadCompanyBanner()  // Upload banner image
- editCompanyLogo()      // Edit/delete logo
- editCompanyBanner()    // Edit/delete banner
```

### API Endpoints

#### Authentication Routes
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
GET    /api/auth/verify-email      # Email verification
POST   /api/auth/verify-mobile     # Mobile verification
```

#### Company Routes
```
POST   /api/company/register       # Create company profile
GET    /api/company/profile        # Get company profile
PUT    /api/company/profile        # Update company profile
POST   /api/company/upload-logo    # Upload company logo
POST   /api/company/upload-banner  # Upload company banner
PUT    /api/company/edit-logo      # Edit/delete logo
PUT    /api/company/edit-banner    # Edit/delete banner
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  mobile_no VARCHAR(20),
  gender CHAR(1) CHECK (gender IN ('m', 'f', 'o')),
  signup_type CHAR(1) DEFAULT 'e',
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_mobile_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Companies Table
```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  company_size VARCHAR(50),
  website VARCHAR(255),
  description TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  founded_year INTEGER,
  founding_story TEXT,
  mission TEXT,
  vision TEXT,
  social_media JSONB DEFAULT '{}',
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deployment Configuration

### Frontend Deployment (Netlify)

#### Build Configuration
```toml
# netlify.toml
[build]
  publish = "frontend/dist"
  command = "cd frontend && npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
```

### Environment Variables

#### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# Development/Production URLs
# VITE_API_URL=https://your-backend-domain.com
```

#### Backend (.env)
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/company_db
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=company_db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing Strategy

### Frontend Testing
```javascript
// Component Testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import ImageUpload from '../components/common/ImageUpload'

describe('ImageUpload Component', () => {
  test('renders upload area', () => {
    render(<ImageUpload />)
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument()
  })
  
  test('validates file size', () => {
    // Test file size validation
  })
  
  test('handles upload errors', () => {
    // Test error handling
  })
})
```

### Backend Testing
```javascript
// API Testing with Jest and Supertest
const request = require('supertest')
const app = require('../server')

describe('Company API', () => {
  test('POST /api/company/register', async () => {
    const response = await request(app)
      .post('/api/company/register')
      .send({
        company_name: 'Test Company',
        industry: 'Technology'
      })
      .expect(201)
    
    expect(response.body.success).toBe(true)
  })
})
```

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy loading of route components
- **Bundle Analysis**: Webpack bundle analyzer for size optimization
- **Image Optimization**: Cloudinary automatic optimization
- **Caching**: Browser caching for static assets
- **Minification**: Production build optimization

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: PostgreSQL connection management
- **Compression**: Gzip compression for API responses
- **Rate Limiting**: API rate limiting for security
- **Logging**: Structured logging for monitoring

## 🔒 Security Implementation

### Frontend Security
- **Input Validation**: Client-side validation with server-side verification
- **XSS Protection**: Content Security Policy headers
- **Authentication**: JWT token management with automatic refresh
- **HTTPS**: Secure communication in production

### Backend Security
- **Authentication**: JWT with secure secret keys
- **Authorization**: Role-based access control
- **Input Sanitization**: SQL injection prevention
- **File Upload Security**: MIME type validation, size limits
- **CORS**: Proper cross-origin resource sharing configuration

## 🚀 Getting Started

### Prerequisites
```bash
# Required software
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Git
- Cloudinary account (for image storage)
```

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd assignment
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables in .env
npm run migrate  # Run database migrations
npm start        # Start development server
```

3. **Frontend Setup**
```bash
cd frontend
npm install
# Configure VITE_API_URL in .env if needed
npm run dev      # Start development server
```

4. **Database Setup**
```bash
# Create PostgreSQL database
createdb company_db

# Run migrations (if using migration system)
npm run migrate

# Seed test data (optional)
npm run seed
```

### Development Workflow

1. **Start Backend Server**
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev  # Starts Vite dev server on http://localhost:5173
```

3. **Run Tests**
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Future Enhancements

### Planned Features
- **Advanced Analytics**: Company profile view analytics
- **Team Management**: Multiple user roles per company
- **Template System**: Pre-designed company profile templates
- **API Integration**: Third-party service integrations
- **Mobile App**: React Native mobile application
- **Advanced Search**: Full-text search capabilities

### Technical Improvements
- **TypeScript Migration**: Full TypeScript implementation
- **Microservices**: Service-oriented architecture
- **Caching Layer**: Redis for improved performance
- **Real-time Updates**: WebSocket integration
- **Advanced Testing**: E2E testing with Playwright
- **Monitoring**: Application performance monitoring

## 🤝 Contributing

### Development Guidelines
- Follow ESLint configuration for code style
- Write tests for new features
- Update documentation for API changes
- Use conventional commits for version control
- Ensure accessibility compliance (WCAG 2.1)

### Code Review Process
1. Create feature branch from main
2. Implement feature with tests
3. Submit pull request with description
4. Code review and approval
5. Merge to main branch

This documentation provides a comprehensive overview of the HireNext Company Profile Management System, covering architecture, implementation details, deployment, and development workflows.
