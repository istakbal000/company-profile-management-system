import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { validators } from '../../utils/errorHandler';

/**
 * Reusable form validation component that displays validation errors
 */
export const ValidationAlert = ({ errors, severity = 'error' }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert severity={severity} sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Please fix the following errors:
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 2 }}>
        {errors.map((error, index) => (
          <li key={index}>
            <Typography variant="body2">{error}</Typography>
          </li>
        ))}
      </Box>
    </Alert>
  );
};

/**
 * Validate form data using the validators utility
 */
export const validateForm = (data, validationRules) => {
  const errors = [];
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = data[field];
    
    rules.forEach(rule => {
      let error = null;
      
      if (typeof rule === 'function') {
        error = rule(value);
      } else if (typeof rule === 'object') {
        const { validator, message, ...params } = rule;
        if (validators[validator]) {
          error = validators[validator](value, ...Object.values(params));
          if (error && message) {
            error = message;
          }
        }
      }
      
      if (error) {
        errors.push(`${field}: ${error}`);
      }
    });
  });
  
  return errors;
};

/**
 * Company profile validation rules
 */
export const companyValidationRules = {
  company_name: [
    validators.required,
    (value) => validators.minLength(value, 2, 'Company name'),
    (value) => validators.maxLength(value, 100, 'Company name')
  ],
  industry: [validators.required],
  company_size: [validators.required],
  website: [validators.url],
  description: [
    (value) => validators.maxLength(value, 1000, 'Description')
  ],
  address: [
    (value) => validators.maxLength(value, 200, 'Address')
  ],
  phone: [validators.phone],
  linkedinUrl: [validators.url],
  twitterUrl: [validators.url],
  facebookUrl: [validators.url],
  instagramUrl: [validators.url]
};

/**
 * User registration validation rules
 */
export const registrationValidationRules = {
  full_name: [
    validators.required,
    (value) => validators.minLength(value, 2, 'Full name'),
    (value) => validators.maxLength(value, 50, 'Full name')
  ],
  email: [validators.email],
  mobile_no: [validators.phone],
  password: [validators.password],
  gender: [validators.required]
};

/**
 * Login validation rules
 */
export const loginValidationRules = {
  email: [validators.email],
  password: [validators.required]
};

export default {
  ValidationAlert,
  validateForm,
  companyValidationRules,
  registrationValidationRules,
  loginValidationRules
};
