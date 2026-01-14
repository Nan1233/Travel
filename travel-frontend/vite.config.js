import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Ép cứng cổng 5173, nếu bị chiếm sẽ báo lỗi chứ không nhảy sang 5174
  }
})