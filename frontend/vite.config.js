import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
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