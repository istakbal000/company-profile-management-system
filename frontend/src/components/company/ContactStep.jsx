import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { validators } from '../../utils/errorHandler';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'India',
  'Singapore',
  'Netherlands',
  'Sweden',
  'Other'
];

const ContactStep = ({ data, onUpdate }) => {
  const { control, watch, formState: { errors } } = useForm({
    defaultValues: data,
    mode: 'onChange'
  });

  const watchedFields = watch();

  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onUpdate(watchedFields);
  }, [watchedFields, onUpdate]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
        Contact Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide contact details for potential candidates and business inquiries
      </Typography>

      <Grid container spacing={3}>
        {/* Email */}
        <Grid item xs={12} md={6}>
          <Controller
            name="email"
            control={control}
            rules={{
              validate: (value) => validators.email(value)
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Contact Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12} md={6}>
          <Controller
            name="phone"
            control={control}
            rules={{
              validate: (value) => !value || validators.phone(value)
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <Controller
            name="address"
            control={control}
            rules={{
              validate: (value) => validators.required(value, 'Address')
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Street Address"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} md={6}>
          <Controller
            name="city"
            control={control}
            rules={{
              validate: (value) => validators.required(value, 'City')
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="City"
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            )}
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} md={6}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="State/Province"
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            )}
          />
        </Grid>

        {/* Zip Code */}
        <Grid item xs={12} md={6}>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="ZIP/Postal Code"
                error={!!errors.zipCode}
                helperText={errors.zipCode?.message}
              />
            )}
          />
        </Grid>

        {/* Country */}
        <Grid item xs={12} md={6}>
          <Controller
            name="country"
            control={control}
            rules={{
              validate: (value) => validators.required(value, 'Country')
            }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Country"
                error={!!errors.country}
                helperText={errors.country?.message}
              >
                {countries.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactStep;