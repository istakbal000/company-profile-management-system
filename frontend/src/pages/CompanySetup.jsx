import React, { useState, useCallback } from 'react';
import {
  Container,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';
import CompanyInfoStep from '../components/company/CompanyInfoStep';
import FoundingInfoStep from '../components/company/FoundingInfoStep';
import SocialMediaStep from '../components/company/SocialMediaStep';
import ContactStep from '../components/company/ContactStep';
import { updateCompany, createCompany, fetchCompany } from '../store/slices/companySlice';

const steps = [
  'Company Info',
  'Founding Info', 
  'Social Media Profile',
  'Contact'
];

const CompanySetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Company Info
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    logo: null,
    banner: null,
    
    // Founding Info
    foundedYear: '',
    foundingStory: '',
    mission: '',
    vision: '',
    
    // Social Media
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    
    // Contact
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const { currentCompany, isLoading, error } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch company data when component mounts
  React.useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  React.useEffect(() => {
    if (currentCompany) {
      // Map backend data to frontend form structure
      const mappedData = {
        // Map backend fields to frontend fields
        name: currentCompany.company_name || '',
        description: currentCompany.description || '',
        website: currentCompany.website || '',
        industry: currentCompany.industry || '',
        size: currentCompany.company_size || '',
        address: currentCompany.address || '',
        city: currentCompany.city || '',
        state: currentCompany.state || '',
        country: currentCompany.country || '',
        zipCode: currentCompany.postal_code || '',
        foundedYear: currentCompany.founded_date ? new Date(currentCompany.founded_date).getFullYear().toString() : '',
        foundingStory: currentCompany.founding_story || '',
        mission: currentCompany.mission || '',
        vision: currentCompany.vision || '',
        linkedinUrl: currentCompany.social_links?.linkedin || '',
        twitterUrl: currentCompany.social_links?.twitter || '',
        facebookUrl: currentCompany.social_links?.facebook || '',
        instagramUrl: currentCompany.social_links?.instagram || '',
        email: currentCompany.email || '',
        phone: currentCompany.phone || '',
        logo: currentCompany.logo_url || null,
        banner: currentCompany.banner_url || null
      };
      
      setFormData(mappedData);
    }
  }, [currentCompany]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUpdateFormData = useCallback((stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData
    }));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setSubmitError(null);
    setIsSubmitting(true);
    
    try {
      if (currentCompany) {
        // Map frontend fields to backend fields for comparison
        const fieldMapping = {
          name: 'company_name',
          description: 'description',
          website: 'website',
          industry: 'industry',
          size: 'company_size',
          address: 'address',
          city: 'city',
          state: 'state',
          country: 'country',
          zipCode: 'postal_code',
          foundedYear: 'founded_date',
          foundingStory: 'founding_story',
          mission: 'mission',
          vision: 'vision',
          email: 'email',
          phone: 'phone',
          linkedinUrl: 'social_links.linkedin',
          twitterUrl: 'social_links.twitter',
          facebookUrl: 'social_links.facebook',
          instagramUrl: 'social_links.instagram'
        };
        
        // Check for changes by comparing mapped fields
        const changedFields = {};
        Object.keys(formData).forEach(key => {
          if (key === 'logo' || key === 'banner') return; // Skip image fields
          
          const backendKey = fieldMapping[key];
          let frontendValue = formData[key];
          let backendValue;
          
          // Handle special cases
          if (key === 'foundedYear') {
            frontendValue = frontendValue ? `${frontendValue}-01-01` : null;
            backendValue = currentCompany.founded_date;
          } else if (key.includes('Url')) {
            // Handle social links
            const platform = key.replace('Url', '').toLowerCase();
            if (platform === 'linkedin') {
              backendValue = currentCompany.social_links?.linkedin || '';
            } else if (platform === 'twitter') {
              backendValue = currentCompany.social_links?.twitter || '';
            } else if (platform === 'facebook') {
              backendValue = currentCompany.social_links?.facebook || '';
            } else if (platform === 'instagram') {
              backendValue = currentCompany.social_links?.instagram || '';
            }
          } else {
            backendValue = currentCompany[backendKey] || '';
          }
          
          // Convert to strings for comparison and handle empty values
          const normalizedFrontend = (frontendValue || '').toString().trim();
          const normalizedBackend = (backendValue || '').toString().trim();
          
          if (normalizedFrontend !== normalizedBackend) {
            changedFields[key] = formData[key];
          }
        });
        
        if (Object.keys(changedFields).length === 0) {
          // No changes detected, show success and redirect
          toast.success('No changes to save - redirecting to dashboard');
          setSubmitSuccess(true);
          setTimeout(() => {
            setSubmitSuccess(false);
            navigate('/dashboard', { replace: true });
          }, 1000);
          return;
        }
        
        // Update company with changes
        await dispatch(updateCompany({ data: changedFields })).unwrap();
        toast.success('Company profile updated successfully!');
      } else {
        // Create new company
        await dispatch(createCompany(formData)).unwrap();
        toast.success('Company profile created successfully!');
      }
      
      // Show success message
      setSubmitSuccess(true);
      
      // Wait a bit for the success message to show, then redirect
      setTimeout(() => {
        // Clear any existing company state before navigating
        // This ensures the dashboard will fetch fresh data
        navigate('/dashboard', { 
          replace: true,
          state: { 
            profileUpdated: true,
            timestamp: Date.now()
          }
        });
      }, 1500);
      
    } catch (error) {
      console.error('Failed to save company:', error);
      setSubmitError(error.message || 'Failed to save company. Please try again.');
      
      // Auto-hide error after 5 seconds
      setTimeout(() => setSubmitError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CompanyInfoStep
            data={formData}
            onUpdate={handleUpdateFormData}
          />
        );
      case 1:
        return (
          <FoundingInfoStep
            data={formData}
            onUpdate={handleUpdateFormData}
          />
        );
      case 2:
        return (
          <SocialMediaStep
            data={formData}
            onUpdate={handleUpdateFormData}
          />
        );
      case 3:
        return (
          <ContactStep
            data={formData}
            onUpdate={handleUpdateFormData}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const isStepOptional = (step) => {
    return step === 1 || step === 2; // Founding Info and Social Media are optional
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Company Setup
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
              Complete your company profile to start attracting top talent
            </Typography>
          </Box>

          {/* Error Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}
          
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSubmitSuccess(false)}>
              {currentCompany ? 'Company profile updated successfully!' : 'Company profile created successfully!'}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

        <Box sx={{ minHeight: 400, mb: 3 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
          {activeStep !== 0 && (
            <Button 
              onClick={handleBack} 
              disabled={isSubmitting}
              variant="outlined"
              sx={{ minWidth: 100 }}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? 'Saving...' : activeStep === steps.length - 1 ? 'Save Profile' : 'Next'}
          </Button>
        </Box>

      </Paper>
    </Container>
  </Layout>
  );
};

export default CompanySetup;