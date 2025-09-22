# 🚀 Render Deployment Guide

## Overview

This guide will help you deploy your full-stack application to Render, which provides free hosting for web services and databases.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Database**: Render provides free PostgreSQL database
4. **Environment Variables**: Gather all required environment variables

## 🛠 Deployment Steps

### Step 1: Set Up Database on Render

1. **Create PostgreSQL Database**:
   - Go to Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Name: `hirenext-db` (or your preferred name)
   - Plan: Free (0.1 CPU, 256MB RAM, 1GB Storage)
   - Click "Create Database"

2. **Note Database Credentials**:
   - After creation, note down the connection details:
     - Host (Internal): `hostname-internal`
     - Host (External): `hostname-external`
     - Database: `database_name`
     - Username: `username`
     - Password: `password`
     - Port: `5432`

3. **Run Database Migrations**:
   - Connect to your database using the external URL
   - Run your migration scripts to create tables

### Step 2: Deploy Backend Service

1. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose the repository containing your project

2. **Configure Backend Service**:
   - **Name**: `hirenext-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (0.1 CPU, 512MB RAM)

3. **Set Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   
   # Database (use internal database URL for better performance)
   PGHOST=your_db_internal_host
   PGPORT=5432
   PGUSER=your_db_user
   PGPASSWORD=your_db_password
   PGDATABASE=your_db_name
   PGSSLMODE=require
   
   # JWT
   JWT_SECRET=your_super_secure_jwt_secret_here
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_FOLDER=company-module
   
   # CORS
   ALLOWED_ORIGINS=https://your-frontend-app.onrender.com
   ```

4. **Deploy Backend**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL: `https://hirenext-backend.onrender.com`

### Step 3: Deploy Frontend Service

1. **Create Static Site**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**:
   - **Name**: `hirenext-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free (100GB bandwidth/month)

3. **Set Environment Variables**:
   ```env
   NODE_ENV=production
   VITE_API_URL=https://hirenext-backend.onrender.com
   ```

4. **Deploy Frontend**:
   - Click "Create Static Site"
   - Wait for build and deployment to complete
   - Your app will be available at: `https://hirenext-frontend.onrender.com`

### Step 4: Update CORS Configuration

1. **Update Backend Environment Variables**:
   - Go to your backend service settings
   - Update `ALLOWED_ORIGINS` to include your frontend URL:
   ```env
   ALLOWED_ORIGINS=https://hirenext-frontend.onrender.com
   ```

2. **Redeploy Backend Service** to apply the changes

## ⚙️ Configuration Files

### Backend Package.json Scripts
Ensure your `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Frontend Environment Variables
In your frontend, ensure API calls use the environment variable:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## 🔧 Render-Specific Considerations

### 1. **Free Plan Limitations**:
- Services sleep after 15 minutes of inactivity
- Cold start time: 10-30 seconds
- Database: 1GB storage limit
- Build time: 500 minutes/month

### 2. **Database Connection**:
- Use internal database host for backend service (faster)
- Database URL format: `postgresql://user:password@host:port/database`

### 3. **HTTPS by Default**:
- All Render services use HTTPS
- Update any hardcoded HTTP URLs to HTTPS

### 4. **Build Process**:
- Render automatically builds when you push to GitHub
- Build logs are available in the dashboard
- Failed builds will show detailed error messages

## 🐛 Troubleshooting

### Common Issues:

1. **Service Won't Start**:
   - Check build logs for errors
   - Verify start command is correct
   - Ensure all environment variables are set

2. **Database Connection Errors**:
   - Verify database credentials
   - Ensure SSL mode is set to 'require'
   - Check if database is using internal vs external host

3. **CORS Errors**:
   - Verify `ALLOWED_ORIGINS` includes your frontend URL
   - Check that frontend is using correct backend URL

4. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Review build command and paths

### Debugging Steps:

1. **Check Service Logs**:
   - Go to service dashboard
   - Click "Logs" tab
   - Look for error messages

2. **Test API Endpoints**:
   - Use browser or Postman to test: `https://your-backend.onrender.com/health`
   - Should return: `{"ok": true}`

3. **Verify Environment Variables**:
   - Check service settings
   - Ensure no typos in variable names
   - Redeploy after changes

## 🚀 Deployment Checklist

- [ ] Database created and migrations run
- [ ] Backend service deployed with correct environment variables
- [ ] Frontend service deployed and building successfully
- [ ] CORS configured with frontend URL
- [ ] API health check returning success
- [ ] Authentication flow working
- [ ] File upload functionality working
- [ ] All routes accessible

## 📈 Going to Production

For production use, consider upgrading to paid plans for:
- **Better Performance**: No sleep, faster cold starts
- **More Resources**: Higher CPU, RAM, and storage limits
- **Better Support**: Priority support and SLA
- **Custom Domains**: Use your own domain name

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Static Sites on Render](https://render.com/docs/static-sites)
- [PostgreSQL on Render](https://render.com/docs/databases)

Your application should now be successfully deployed on Render! 🎉