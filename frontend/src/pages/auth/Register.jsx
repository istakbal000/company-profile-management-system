import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material'
import { toast } from 'react-toastify'

import { authAPI } from '../../services/api'
import { registerStart, registerSuccess, registerFailure } from '../../store/slices/authSlice'
import { handleError, validators } from '../../utils/errorHandler'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      dispatch(registerStart())
      
      const userData = {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        gender: data.gender,
        mobile_no: data.mobile_no.startsWith('+') ? data.mobile_no : `+${data.mobile_no}`,
      }

      const response = await authAPI.register(userData)
      
      dispatch(registerSuccess({ user: { id: response.data.data.user_id, email: data.email } }))
      toast.success('Registration successful! Please login with your credentials.')
      navigate('/login')
    } catch (error) {
      const appError = handleError(error, {
        showToast: true,
        customMessage: 'Registration failed. Please check your information and try again.'
      })
      dispatch(registerFailure(appError.message))
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Join HireNext
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account to get started
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              id="full_name"
              name="full_name"
              label="Full Name"
              autoComplete="name"
              {...register('full_name', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              id="mobile_no"
              name="mobile_no"
              label="Mobile Number"
              autoComplete="tel"
              {...register('mobile_no', { 
                required: 'Mobile number is required',
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: 'Invalid mobile number'
                }
              })}
              error={!!errors.mobile_no}
              helperText={errors.mobile_no?.message}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              id="gender"
              name="gender"
              select
              label="Gender"
              autoComplete="sex"
              {...register('gender', { required: 'Gender is required' })}
              error={!!errors.gender}
              helperText={errors.gender?.message}
              sx={{ mb: 3 }}
            >
              <MenuItem value="m">Male</MenuItem>
              <MenuItem value="f">Female</MenuItem>
              <MenuItem value="o">Other</MenuItem>
            </TextField>

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: 'Password must contain uppercase, lowercase, number and special character'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mb: 3, 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" sx={{ fontWeight: 600 }}>
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register