import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    },
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          admin: [
            './src/pages/admin/Dashboard.jsx',
            './src/pages/admin/ProfileEditor.jsx',
            './src/pages/admin/SectionsEditor.jsx',
            './src/pages/admin/CoursesEditor.jsx'
          ],
          ui: ['@headlessui/react', '@heroicons/react'],
          editor: ['@uiw/react-md-editor']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    __DEV__: JSON.stringify(false)
  }
})