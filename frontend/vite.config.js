import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // Split large UI libraries
            if (id.includes('@mui/material') || id.includes('@emotion')) {
              return 'mui-vendor';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'redux-vendor';
            }
            // Other vendor libraries
            return 'vendor';
          }
        },
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5173, // Run frontend on port 5173 (Vite default)
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: 'http://localhost:3000', // Your backend server's address
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Optional: if you have an https backend
      },
    },
  },
})