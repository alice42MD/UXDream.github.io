/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, 
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTest.tsx'],
    coverage: {
      provider: 'istanbul', // or 'v8'
      reporter: ['html'],
      exclude: ['./src/stories', '.storybook']
    },
    deps: {
      optimizer: {
        ssr: {
          enabled: true,
          include: ["@vitest/ui"],
        }
      }
    },
   
  },
})
