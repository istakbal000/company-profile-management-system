import React, { useState, useEffect } from 'react';
import { batch } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Link,
  Alert,
  Chip,
  Paper,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Language as WebsiteIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateCompany, fetchCompany, uploadCompanyLogo, uploadCompanyBanner, editCompanyLogo, editCompanyBanner } from '../../store/slices/companySlice';
import ImageUpload from '../common/ImageUpload';
import { handleError } from '../../utils/errorHandler';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Marketing',
  'Real Estate',
  'Other'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
];

const CompanyInfoStep = ({ data, onUpdate }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { company, loading } = useSelector((state) => state.company);
  
  // Track which fields are in edit mode
  const [editMode, setEditMode] = useState({});
  
  // Track image upload states
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [logoError, setLogoError] = useState(null);
  const [bannerError, setBannerError] = useState(null);

  const { control, formState: { errors }, setValue, watch, getValues } = useForm({
    defaultValues: {
      name: data?.name || '',
      industry: data?.industry || '',
      description: data?.description || '',
      website: data?.website || '',
      companySize: data?.companySize || ''
    }
  });
  
  // Helper function to check if a field has data
  const hasValue = (value) => {
    return value && value.toString().trim() !== '';
  };
  
  // Toggle edit mode for a specific field
  const toggleEditMode = (fieldName) => {
    setEditMode(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };
  
  // Save field and exit edit mode
  const saveField = (fieldName) => {
    setEditMode(prev => ({
      ...prev,
      [fieldName]: false
    }));
  };

  const watchedFields = watch();

  // Sync form changes with parent component
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // Only update parent if a field has a value and is not in the process of being set
      if (name && value[name] !== undefined) {
        onUpdate(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  // Initialize form with data when component mounts or data changes
  useEffect(() => {
    if (data) {
      // Only update fields that exist in the form
      const formValues = getValues();
      const updates = {};
      
      Object.keys(formValues).forEach(key => {
        if (data[key] !== undefined && data[key] !== formValues[key]) {
          updates[key] = data[key];
        }
      });
      
      if (Object.keys(updates).length > 0) {
        // Batch updates to prevent multiple re-renders
        batch(() => {
          Object.entries(updates).forEach(([key, value]) => {
            setValue(key, value, { shouldDirty: false });
          });
        });
      }
    }
  }, [data, setValue, getValues]);
  
  // Render field based on whether it has data and edit mode
  const renderField = (fieldName, label, fieldProps = {}) => {
    const value = watchedFields[fieldName];
    const isInEditMode = editMode[fieldName];
    const fieldHasValue = hasValue(value);
    
    // If field is empty or in edit mode, show editable field
    if (!fieldHasValue || isInEditMode) {
      return (
        <Box sx={{ mb: 2 }}>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={label}
                fullWidth
                variant="outlined"
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message}
                {...fieldProps}
                InputProps={{
                  ...fieldProps.InputProps,
                  endAdornment: fieldHasValue && isInEditMode ? (
                    <IconButton 
                      onClick={() => saveField(fieldName)}
                      color="primary"
                      size="small"
                    >
                      <CheckIcon />
                    </IconButton>
                  ) : null
                }}
              />
            )}
          />
        </Box>
      );
    }
    
    // If field has data and not in edit mode, show display mode
    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {value}
              </Typography>
            </Box>
            <IconButton 
              onClick={() => toggleEditMode(fieldName)}
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Handle logo upload
  const handleLogoUpload = async (file) => {
    setLogoUploading(true);
    setLogoError(null);
    try {
      await dispatch(uploadCompanyLogo(file)).unwrap();
      // Refresh company data to get updated logo URL
      await dispatch(fetchCompany());
    } catch (error) {
      const appError = handleError(error, {
        showToast: false, // We'll show error in component
        logToConsole: true
      });
      setLogoError(appError.message);
    } finally {
      setLogoUploading(false);
    }
  };
  
  // Handle banner upload
  const handleBannerUpload = async (file) => {
    setBannerUploading(true);
    setBannerError(null);
    try {
      await dispatch(uploadCompanyBanner(file)).unwrap();
      // Refresh company data to get updated banner URL
      await dispatch(fetchCompany());
    } catch (error) {
      const appError = handleError(error, {
        showToast: false, // We'll show error in component
        logToConsole: true
      });
      setBannerError(appError.message);
    } finally {
      setBannerUploading(false);
    }
  };
  
  // Handle logo delete
  const handleLogoDelete = async () => {
    try {
      await dispatch(editCompanyLogo(null)).unwrap();
      await dispatch(fetchCompany());
    } catch (error) {
      const appError = handleError(error, {
        showToast: false,
        logToConsole: true
      });
      setLogoError(appError.message);
    }
  };
  
  // Handle banner delete
  const handleBannerDelete = async () => {
    try {
      await dispatch(editCompanyBanner(null)).unwrap();
      await dispatch(fetchCompany());
    } catch (error) {
      const appError = handleError(error, {
        showToast: false,
        logToConsole: true
      });
      setBannerError(appError.message);
    }
  };

  // Function to check profile completion and log missing fields
  const checkProfileCompletion = (profileData) => {
    const requiredFields = {
      'Company Name': profileData.name,
      'Description': profileData.description,
      'Website': profileData.website,
      'Industry': profileData.industry,
      'Company Logo': profileData.logo,
      'Company Banner': profileData.banner
    };

    const missingFields = [];
    const completedFields = [];

    Object.entries(requiredFields).forEach(([fieldName, value]) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(fieldName);
      } else {
        completedFields.push(fieldName);
      }
    });


    return {
      completed: completedFields,
      missing: missingFields,
      percentage: Math.round((completedFields.length / Object.keys(requiredFields).length) * 100)
    };
  };

  // Check profile completion whenever data changes
  React.useEffect(() => {
    if (data.name || data.description || data.logo || data.banner) {
      checkProfileCompletion(data);
    }
  }, [data.name, data.description, data.logo, data.banner, data.website, data.industry]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Company Information
      </Typography>

      {/* Profile Completion Summary */}
      {(data.name || data.description || data.logo || data.banner) && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            📋 Profile Completion Status
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[
              { field: 'Company Name', value: data.name, required: true },
              { field: 'Description', value: data.description, required: true },
              { field: 'Website', value: data.website, required: false },
              { field: 'Industry', value: data.industry, required: true },
              { field: 'Logo', value: data.logo, required: false },
              { field: 'Banner', value: data.banner, required: false }
            ].map(({ field, value, required }) => (
              <Box
                key={field}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  backgroundColor: value ? '#e8f5e8' : (required ? '#fff3e0' : '#f0f0f0'),
                  color: value ? '#2e7d32' : (required ? '#ef6c00' : '#666'),
                  border: `1px solid ${value ? '#4caf50' : (required ? '#ff9800' : '#ccc')}`
                }}
              >
                {value ? '✅' : (required ? '⚠️' : '📝')} {field}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Company Name */}
        <Grid item xs={12} sm={6}>
          {renderField('name', 'Company Name', {
            rules: { required: 'Company name is required' }
          })}
        </Grid>

        {/* Website */}
        <Grid item xs={12} sm={6}>
          {renderField('website', 'Website URL')}
        </Grid>

        {/* Industry */}
        <Grid item xs={12} sm={6}>
          {renderField('industry', 'Industry', {
            select: true,
            rules: { required: 'Industry is required' },
            children: industries.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))
          })}
        </Grid>

        {/* Company Size */}
        <Grid item xs={12} sm={6}>
          {renderField('companySize', 'Company Size', {
            select: true,
            rules: { required: 'Company size is required' },
            children: companySizes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))
          })}
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          {renderField('description', 'Company Description', {
            multiline: true,
            rows: 4
          })}
        </Grid>
        
        {/* Company Logo */}
        <Grid item xs={12} sm={6}>
          <ImageUpload
            label="Company Logo"
            currentImage={company?.logo_url}
            onImageUpload={handleLogoUpload}
            onImageDelete={handleLogoDelete}
            aspectRatio="1:1"
            height={200}
            placeholder="Upload your company logo"
            isLoading={logoUploading}
            error={logoError}
          />
        </Grid>
        
        {/* Company Banner */}
        <Grid item xs={12} sm={6}>
          <ImageUpload
            label="Company Banner"
            currentImage={company?.banner_url}
            onImageUpload={handleBannerUpload}
            onImageDelete={handleBannerDelete}
            aspectRatio="16:9"
            height={200}
            placeholder="Upload your company banner"
            isLoading={bannerUploading}
            error={bannerError}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyInfoStep;