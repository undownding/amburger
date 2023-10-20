import { defineConfig } from 'vite'
import defaultConfig from './vite.config.js'

export default defineConfig({
  ...defaultConfig,
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        preserveModules: false,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
})
