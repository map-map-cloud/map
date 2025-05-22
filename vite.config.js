import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  server: {
    host: '0.0.0.0',  // 允許所有IP連接
    port: 80         // 預設端口
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
//1 URL('./src', import.meta.url))