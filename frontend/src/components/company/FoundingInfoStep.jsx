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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

const FoundingInfoStep = ({ data, onUpdate }) => {
  const { control, watch, formState: { errors } } = useForm({
    defaultValues: data,
    mode: 'onChange'
  });

  const watchedFields = watch();

  // Only notify parent when user makes changes, not on initial load
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Founding Information
      </Typography>

      <Grid container spacing={3}>
        {/* Founded Year */}
        <Grid item xs={12} md={6}>
          <Controller
            name="foundedYear"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Founded Year"
                error={!!errors.foundedYear}
                helperText={errors.foundedYear?.message}
              >
                <MenuItem value="">
                  <em>Select year</em>
                </MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Founding Story */}
        <Grid item xs={12}>
          <Controller
            name="foundingStory"
            control={control}
            rules={{
              validate: (value) => !value || validators.maxLength(value, 1000, 'Founding story')
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Founding Story"
                multiline
                rows={4}
                placeholder="Share the story of how your company was founded..."
                error={!!errors.foundingStory}
                helperText={errors.foundingStory?.message}
              />
            )}
          />
        </Grid>

        {/* Mission */}
        <Grid item xs={12}>
          <Controller
            name="mission"
            control={control}
            rules={{
              validate: (value) => !value || validators.maxLength(value, 500, 'Mission statement')
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Mission Statement"
                multiline
                rows={3}
                placeholder="What is your company's mission?"
                error={!!errors.mission}
                helperText={errors.mission?.message}
              />
            )}
          />
        </Grid>

        {/* Vision */}
        <Grid item xs={12}>
          <Controller
            name="vision"
            control={control}
            rules={{
              validate: (value) => !value || validators.maxLength(value, 500, 'Vision statement')
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Vision Statement"
                multiline
                rows={3}
                placeholder="What is your company's vision for the future?"
                error={!!errors.vision}
                helperText={errors.vision?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FoundingInfoStep;