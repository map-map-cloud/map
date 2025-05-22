import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',  // 允許所有IP連接
    port: 80          // 修改端口為80
  },
  plugins: [vue()],
  base: './',  // 修改為相對路徑，確保在子目錄也能正常訪問
  publicDir: 'public',  // 指定 public 目錄
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    },
    copyPublicDir: true  // 確保複製 public 目錄到根目錄
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "bootstrap/scss/functions";`,
      },
    },
  },
})
