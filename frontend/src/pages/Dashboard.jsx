import React, { useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';
import { fetchCompany } from '../store/slices/companySlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentCompany, isLoading, error } = useSelector((state) => state.company);

  // Check if we're coming from profile update
  const isProfileUpdated = location.state?.profileUpdated;

  useEffect(() => {
    // Always fetch company data when component mounts
    console.log('Dashboard: Fetching company data on mount');
    dispatch(fetchCompany());
  }, [dispatch]);

  // Additional effect to handle profile update redirect
  useEffect(() => {
    if (isProfileUpdated) {
      // Show success message
      toast.success('Welcome back! Your profile has been updated successfully.');
      
      // Clear the navigation state to prevent re-fetching on subsequent renders
      navigate(location.pathname, { replace: true, state: {} });
      
      // Force refresh company data
      setTimeout(() => {
        dispatch(fetchCompany());
      }, 100);
    }
  }, [isProfileUpdated, dispatch, navigate, location.pathname]);

  const getCompletionPercentage = () => {
    if (!currentCompany) return 0;
    
    const fields = [
      currentCompany.company_name,
      currentCompany.description,
      currentCompany.website,
      currentCompany.industry,
      currentCompany.address,
      currentCompany.logo_url,
    ];
    
    const completed = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleSetupCompany = () => {
    navigate('/company-setup');
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your company profile and job postings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading && !currentCompany && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
            Loading company profile...
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Company Profile Display */}
        {currentCompany && (
          <Grid item xs={12}>
            <Card elevation={2}>
              {/* Company Banner */}
              {currentCompany.banner_url && (
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${currentCompany.banner_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
              )}
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  {/* Company Logo */}
                  {currentCompany.logo_url ? (
                    <Avatar
                      src={currentCompany.logo_url}
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        border: '3px solid white',
                        boxShadow: 2
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        backgroundColor: 'primary.main',
                        border: '3px solid white',
                        boxShadow: 2
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {currentCompany.company_name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {currentCompany.industry} • {currentCompany.city}, {currentCompany.state}
                    </Typography>
                    {!currentCompany.logo_url && !currentCompany.banner_url && (
                      <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 1 }}>
                        💡 Upload a logo and banner to enhance your profile
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={handleSetupCompany}
                    disabled={isLoading}
                  >
                    Edit Profile
                  </Button>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {currentCompany.description || 'No description provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Website
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {currentCompany.website ? (
                        <a href={currentCompany.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                          {currentCompany.website}
                        </a>
                      ) : (
                        'No website provided'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {currentCompany.address}<br />
                      {currentCompany.city}, {currentCompany.state} {currentCompany.postal_code}<br />
                      {currentCompany.country}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Founded
                    </Typography>
                    <Typography variant="body1">
                      {currentCompany.founded_date ? new Date(currentCompany.founded_date).getFullYear() : 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Profile Completion: {getCompletionPercentage()}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getCompletionPercentage()} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Company Setup Card */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {currentCompany ? 'Company Profile Status' : 'Company Profile Setup'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentCompany ? 'Manage and update your company information' : 'Complete your company profile to start posting jobs'}
                  </Typography>
                </Box>
              </Box>

              {currentCompany ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      Profile Completion: {getCompletionPercentage()}%
                    </Typography>
                    {getCompletionPercentage() === 100 ? (
                      <CheckCircleIcon sx={{ color: 'success.main' }} />
                    ) : (
                      <WarningIcon sx={{ color: 'warning.main' }} />
                    )}
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={getCompletionPercentage()} 
                    sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSetupCompany}
                    disabled={isLoading}
                  >
                    {getCompletionPercentage() === 100 ? 'Edit Profile' : 'Continue Setup'}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    You haven't set up your company profile yet. Get started to unlock all features.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleSetupCompany}
                    disabled={isLoading}
                  >
                    Set Up Company Profile
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    0
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Active Job Posts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary.main" gutterBottom>
                    0
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Applications Received
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 6,
                  color: 'text.secondary'
                }}
              >
                <Typography variant="body1">
                  No recent activity. Complete your company setup to get started!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;