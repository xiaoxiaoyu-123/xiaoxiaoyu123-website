import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://47.99.33.44:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
