// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'auth/login.html'),
        getstarted: resolve(__dirname, 'auth/getstarted.html'),
        read: resolve(__dirname, 'read.html'),
      },
    },
  },
})