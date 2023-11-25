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
        account: resolve(__dirname, 'account.html'),
        resourceWelcome: resolve(__dirname, 'resources/welcome.html'),
        resourceGNews: resolve(__dirname, 'resources/gnews.html'),
        resourceOpenAI: resolve(__dirname, 'resources/openai.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
  },
})