# Vercel Deployment Guide for HireNext

## 🚀 Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Gather all required environment variables
4. **Database**: Set up a production PostgreSQL database (recommend Neon, Supabase, or Railway)

## 📋 Required Environment Variables

You'll need to configure these environment variables in Vercel:

### **Backend Environment Variables**
```env
# Database Configuration
PGHOST=your_production_db_host
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGSSLMODE=require

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=company-module

# Production Environment
NODE_ENV=production
VERCEL_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-app-name.vercel.app
```

### **Frontend Environment Variables**
```env
# API Configuration (leave empty for production - will use same domain)
VITE_API_URL=

# Environment
NODE_ENV=production
```

## 🔧 Deployment Steps

### **Step 1: Prepare Your Repository**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### **Step 2: Set Up Production Database**

1. **Choose a Database Provider**:
   - **Neon** (Recommended): [neon.tech](https://neon.tech) - Free tier with PostgreSQL
   - **Supabase**: [supabase.com](https://supabase.com) - Free tier with PostgreSQL
   - **Railway**: [railway.app](https://railway.app) - Simple PostgreSQL hosting

2. **Create Database**:
   - Create a new PostgreSQL database
   - Note down the connection details
   - Ensure SSL is enabled

3. **Run Database Migrations**:
   ```bash
   # Set your production database URL
   export DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   
   # Run migrations
   cd backend
   npm run migrate
   ```

### **Step 3: Deploy to Vercel**

1. **Import Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install && cd ../backend && npm install`

3. **Add Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add all the environment variables listed above
   - Make sure to set them for "Production", "Preview", and "Development"

### **Step 4: Configure Domain (Optional)**

1. **Custom Domain**:
   - Go to project settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## 🔍 Verification Steps

After deployment, verify everything is working:

### **1. Check API Health**
Visit: `https://your-app.vercel.app/api/health`
Should return: `{"ok": true, "env": "production"}`

### **2. Test Authentication**
- Register a new user
- Login with credentials
- Verify JWT tokens are working

### **3. Test File Upload**
- Create a company profile
- Upload logo and banner images
- Verify Cloudinary integration works

### **4. Test Database**
- Create and update company profiles
- Verify data persistence
- Check database connections

## 🐛 Troubleshooting

### **Common Issues and Solutions**

#### **1. Build Failures**
```
Error: Cannot find module 'xyz'
```
**Solution**: Ensure all dependencies are in `package.json`, not just `devDependencies`

#### **2. Environment Variable Issues**
```
Error: Missing required environment variables
```
**Solution**: 
- Double-check all environment variables are set in Vercel
- Ensure variable names match exactly
- Redeploy after adding variables

#### **3. Database Connection Issues**
```
Error: connect ETIMEDOUT
```
**Solution**:
- Verify database host and credentials
- Ensure SSL mode is set to `require`
- Check if database allows connections from Vercel IPs

#### **4. CORS Issues**
```
Error: CORS policy blocked
```
**Solution**:
- Update `FRONTEND_URL` environment variable
- Ensure CORS is configured for your domain
- Check Vercel app URL is correct

#### **5. File Upload Issues**
```
Error: Cloudinary upload failed
```
**Solution**:
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper image formats

## 📊 Performance Optimization

### **1. Frontend Optimizations**
- Static assets are automatically cached by Vercel CDN
- Images are optimized automatically
- Gzip compression is enabled

### **2. Backend Optimizations**
- Functions have 30-second timeout
- Memory is automatically optimized
- Cold starts are minimized

### **3. Database Optimizations**
- Use connection pooling for PostgreSQL
- Implement proper indexing
- Consider read replicas for scaling

## 🔐 Security Considerations

### **1. Environment Variables**
- Never commit sensitive data to git
- Use strong JWT secrets
- Rotate API keys regularly

### **2. Database Security**
- Use SSL connections always
- Implement proper user permissions
- Regular security updates

### **3. CORS Configuration**
- Limit allowed origins
- Use specific domains, not wildcards
- Implement proper headers

## 📈 Monitoring and Maintenance

### **1. Vercel Analytics**
- Enable Vercel Analytics for performance monitoring
- Monitor function execution times
- Track error rates

### **2. Database Monitoring**
- Monitor connection pool usage
- Track query performance
- Set up alerts for downtime

### **3. Logs**
- Check Vercel function logs regularly
- Monitor error patterns
- Set up log aggregation if needed

## 🔄 Continuous Deployment

### **Automatic Deployments**
- Vercel automatically deploys on git push to main branch
- Preview deployments for pull requests
- Rollback capabilities for issues

### **Branch Deployments**
- `main` branch → Production
- `develop` branch → Preview
- Feature branches → Preview deployments

## 🆘 Support

If you encounter issues:

1. **Check Vercel Logs**: Project → Functions tab → View logs
2. **Database Logs**: Check your database provider's logs
3. **Browser Console**: Look for frontend errors
4. **Network Tab**: Check API request/response details

## 📞 Quick Commands

```bash
# Test production build locally
cd frontend && npm run build && npm run preview

# Check backend locally with production settings
cd backend && NODE_ENV=production npm start

# Deploy manually (if needed)
vercel --prod

# Check deployment status
vercel ls

# View function logs
vercel logs
```

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Production database created and migrated
- [ ] All environment variables configured in Vercel
- [ ] Project imported and configured in Vercel
- [ ] Build completes successfully
- [ ] API health check passes
- [ ] Authentication flow works
- [ ] File upload functionality works
- [ ] Database operations work
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] Performance monitoring set up

Your HireNext application should now be successfully deployed on Vercel! 🎉