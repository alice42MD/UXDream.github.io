/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, 
    environment: 'jsdom',
    setupFiles: './setupTest.tsx',
    coverage: {
      provider: 'istanbul', // or 'v8'
      reporter: ['html'],
    },
  },
})
