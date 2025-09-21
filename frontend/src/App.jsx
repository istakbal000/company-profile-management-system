import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Container, Box } from '@mui/material'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import CompanySetup from './pages/CompanySetup'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'
import { logout } from './store/slices/authSlice'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-setup"
            element={
              <ProtectedRoute>
                <CompanySetup />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </ErrorBoundary>
  )
}

export default App