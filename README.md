# Company Profile Management System

A full-stack web application for managing company profiles with image upload capabilities using Cloudinary integration.

## Project Structure

```
assignment/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── config/         # Configuration files (DB, Cloudinary, Firebase)
│   │   ├── controllers/    # Route handlers
│   │   ├── database/       # Database migrations and setup
│   │   ├── middleware/     # Authentication, validation, upload middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # External service integrations
│   │   ├── tests/          # Unit and integration tests
│   │   └── utils/          # Utility functions
│   ├── logs/               # Application logs (auto-generated)
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies and scripts
│   └── server.js           # Application entry point
├── frontend/               # React.js client application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Redux store and slices
│   │   └── styles/         # Theme and styling
│   ├── package.json        # Dependencies and scripts
│   └── index.html          # HTML template
└── README.md               # This file
```

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Company Profile Management**: Create and update company information
- **Image Upload**: Logo and banner upload with Cloudinary integration
- **Multi-step Forms**: Guided company setup process
- **Responsive Design**: Mobile-friendly UI with Material-UI
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and logging

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database
- **Cloudinary** for image storage
- **Firebase Admin** for authentication
- **JWT** for session management
- **Winston** for logging
- **Jest** for testing

### Frontend
- **React 18** with hooks
- **Redux Toolkit** for state management
- **Material-UI (MUI)** for components
- **React Hook Form** for form handling
- **React Router** for navigation
- **Axios** for API calls
- **Vite** for build tooling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Cloudinary account
- Firebase project (optional)

## 🚀 Deployment

### Environment Variables Required for Production

```env
# Database
PGHOST=your_production_db_host
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name

# Authentication
JWT_SECRET=your_jwt_secret

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=company_db

   # JWT
   JWT_SECRET=your_jwt_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=company-profiles

   # Firebase (optional)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```

5. Run database migrations:
   ```bash
   npm run migrate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Company Management
- `GET /api/company/profile` - Get company profile
- `POST /api/company/register` - Create company profile
- `PUT /api/company/profile` - Update company profile
- `POST /api/company/upload-logo` - Upload company logo
- `POST /api/company/upload-banner` - Upload company banner
- `PUT /api/company/edit-logo` - Edit existing logo
- `PUT /api/company/edit-banner` - Edit existing banner

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application (if needed)
3. Start with PM2 or similar process manager:
   ```bash
   npm start
   ```

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with a web server

## Code Quality

This project has been optimized for:
- **Clean Code**: Removed unnecessary console.log statements and debug code
- **Minimal Dependencies**: Removed unused packages to reduce bundle size
- **Error Handling**: Comprehensive error handling throughout the application
- **Security**: Helmet.js, CORS, input validation, and sanitization
- **Performance**: Compression, image optimization, and efficient queries

## Contributing

1. Follow the existing code style and structure
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## License

This project is for educational/assignment purposes.
