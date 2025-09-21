# Image Upload Troubleshooting Guide

## Common Issues and Solutions

### 1. Images Not Uploading
**Symptoms:** Upload spinner appears but fails
**Possible Causes:**
- Missing Cloudinary environment variables
- Network connectivity issues
- File too large (>5MB)
- Invalid file format

**Solutions:**
1. Check browser console for error messages
2. Verify backend logs for detailed error information
3. Ensure Cloudinary credentials are properly set
4. Try with a smaller image file (< 2MB)

### 2. Preview Not Updating
**Symptoms:** Image uploads successfully but preview doesn't change
**Solutions:**
1. Refresh the page to reload company data
2. Check if the Redux state is updating properly
3. Look for console errors in the browser

### 3. File Validation Errors
**Symptoms:** Valid images are rejected
**Solutions:**
1. Ensure file is under 5MB
2. Use supported formats: JPEG, PNG, GIF, WebP
3. Check file extension matches file type

### 4. Network Errors
**Symptoms:** Upload fails with network/timeout errors
**Solutions:**
1. Check if backend server is running (http://localhost:3000/health)
2. Verify CORS settings
3. Check network connectivity

## Debugging Steps

### Frontend Debugging:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for ImageUpload logs and error messages
4. Check Network tab for failed requests

### Backend Debugging:
1. Check server console logs
2. Look for CloudinaryService and Controller logs
3. Verify database connections
4. Test Cloudinary connectivity: `POST /api/company/test-cloudinary`

## Performance Optimization

### Image Upload Best Practices:
1. **Compress images** before upload (use tools like TinyPNG)
2. **Resize images** to appropriate dimensions:
   - Logos: 400x400px (1:1 ratio)
   - Banners: 1200x675px (16:9 ratio)
3. **Use optimized formats**: WebP > PNG > JPEG
4. **Implement progress indicators** for better UX

### Code Optimizations:
1. **Add image compression** on the frontend before upload
2. **Implement retry logic** for failed uploads
3. **Add caching** for uploaded images
4. **Use lazy loading** for image previews

## Environment Setup Checklist

### Required Environment Variables:
```bash
# Backend (.env)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=company-module

# Database
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=company_db

# JWT
JWT_SECRET=your_secret_key
```

### Frontend Configuration:
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

## Common Error Messages

### "Cloudinary configuration is incomplete"
- Check if all Cloudinary environment variables are set
- Restart the backend server after setting variables

### "File size must be less than 5MB"
- Compress the image or choose a smaller file
- Consider increasing the limit in upload.js if needed

### "Invalid file type"
- Use supported formats: JPEG, PNG, GIF, WebP
- Check if file extension matches actual file type

### "Network Error"
- Verify backend server is running
- Check if ports 3000 (backend) and 5173 (frontend) are available
- Verify firewall settings

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend connects to backend
- [ ] User can register/login
- [ ] Company profile page loads
- [ ] Image upload component appears
- [ ] File validation works correctly
- [ ] Images upload successfully
- [ ] Previews update immediately
- [ ] Images persist after page refresh
- [ ] Error messages are clear and helpful

## Support Contacts

For additional help:
1. Check application logs first
2. Review this troubleshooting guide
3. Test with different image files
4. Verify all environment variables are set