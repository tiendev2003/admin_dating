import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Địa chỉ backend của bạn
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Đảm bảo URL phù hợp với backend
      },
    },
  },
})
