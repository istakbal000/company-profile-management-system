# Render Environment Variables Configuration

Set these environment variables in your Render service dashboard:

## Required Environment Variables:

### Database Configuration
- **DATABASE_URL**: `postgresql://your_render_user:your_render_password@your_render_host:5432/your_render_db?sslmode=require`
  - Get this from your Render PostgreSQL service dashboard
  - Must include `?sslmode=require` for Render

### Application Configuration
- **NODE_ENV**: `production`
- **JWT_SECRET**: `your-secure-jwt-secret-for-production`
- **PORT**: (Render sets this automatically, usually 10000)

### Cloudinary Configuration
- **CLOUDINARY_CLOUD_NAME**: `dvozpk5m9`
- **CLOUDINARY_API_KEY**: `121747625929523`
- **CLOUDINARY_API_SECRET**: `G1T7JCteeEeNV44N4FzF8V0Qb_o`
- **CLOUDINARY_FOLDER**: `company-module`

### Firebase Configuration (Optional)
- **FIREBASE_SERVICE_ACCOUNT**: `irebase-adminsdk-fbsvc@auth-1b4b2.iam.gserviceaccount.com`
- **FIREBASE_PROJECT_ID**: `auth-1b4b2`

### CORS Configuration
- **ALLOWED_ORIGINS**: `https://your-frontend-app.onrender.com,http://localhost:3000,http://localhost:5173`
  - Replace `your-frontend-app.onrender.com` with your actual frontend URL

## Steps to Configure:

1. **Go to your Render Dashboard**
2. **Select your backend service**
3. **Go to Environment tab**
4. **Add each environment variable above**
5. **Deploy your service**

## Important Notes:

- **Never commit production secrets to Git**
- **Use Render's environment variables for all sensitive data**
- **Ensure your PostgreSQL service is in the same region as your web service**
- **Test the connection after deployment**

## Troubleshooting:

If you still get ECONNREFUSED:
1. Check your DATABASE_URL format
2. Ensure PostgreSQL service is running in Render
3. Verify the database credentials
4. Check if services are in the same region
5. Ensure SSL is enabled (`sslmode=require`)