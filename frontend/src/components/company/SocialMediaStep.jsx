import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  InputAdornment,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Edit as EditIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { validators } from '../../utils/errorHandler';

const SocialMediaStep = ({ data, onUpdate }) => {
  const [formValues, setFormValues] = React.useState({
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    instagramUrl: ''
  });
  
  // Track which fields are in edit mode
  const [editMode, setEditMode] = React.useState({});
  
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

  // Update form values when data changes
  React.useEffect(() => {
    const newValues = {
      linkedinUrl: data?.linkedinUrl || '',
      twitterUrl: data?.twitterUrl || '',
      facebookUrl: data?.facebookUrl || '',
      instagramUrl: data?.instagramUrl || ''
    };
    
    setFormValues(newValues);
  }, [data]);

  // Only notify parent when user makes changes, not on initial load
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onUpdate(formValues);
  }, [formValues, onUpdate]);

  const handleChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate URL field
  const validateUrl = (value) => {
    if (!value) return null; // URL is optional
    return validators.url(value);
  };
  
  // Render social media field with conditional display
  const renderSocialField = (fieldName, label, placeholder, icon, iconColor) => {
    const value = formValues[fieldName];
    const isInEditMode = editMode[fieldName];
    const fieldHasValue = hasValue(value);
    
    // If field is empty or in edit mode, show editable field
    if (!fieldHasValue || isInEditMode) {
      const validationError = validateUrl(value);
      return (
        <TextField
          fullWidth
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(fieldName, e.target.value)}
          error={!!validationError}
          helperText={validationError}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {icon}
              </InputAdornment>
            ),
            endAdornment: fieldHasValue && isInEditMode ? (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => saveField(fieldName)}
                  color="primary"
                  size="small"
                  disabled={!!validationError}
                >
                  <CheckIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
      );
    }
    
    // If field has data and not in edit mode, show display mode
    return (
      <Card variant="outlined">
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {icon}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: iconColor, textDecoration: 'none' }}>
                    {value}
                  </a>
                </Typography>
              </Box>
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

  const urlPattern = {
    value: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://'
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
        Social Media Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Connect your social media profiles to help candidates learn more about your company culture
      </Typography>

      <Grid container spacing={3}>
        {/* LinkedIn */}
        <Grid item xs={12}>
          {renderSocialField(
            'linkedinUrl',
            'LinkedIn Company Page',
            'https://linkedin.com/company/your-company',
            <LinkedInIcon sx={{ color: '#0077B5' }} />,
            '#0077B5'
          )}
        </Grid>

        {/* Twitter */}
        <Grid item xs={12}>
          {renderSocialField(
            'twitterUrl',
            'Twitter Profile',
            'https://twitter.com/your-company',
            <TwitterIcon sx={{ color: '#1DA1F2' }} />,
            '#1DA1F2'
          )}
        </Grid>

        {/* Facebook */}
        <Grid item xs={12}>
          {renderSocialField(
            'facebookUrl',
            'Facebook Page',
            'https://facebook.com/your-company',
            <FacebookIcon sx={{ color: '#4267B2' }} />,
            '#4267B2'
          )}
        </Grid>

        {/* Instagram */}
        <Grid item xs={12}>
          {renderSocialField(
            'instagramUrl',
            'Instagram Profile',
            'https://instagram.com/your-company',
            <InstagramIcon sx={{ color: '#E4405F' }} />,
            '#E4405F'
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SocialMediaStep;