import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: ['**/node_modules/**', '.claude/**'],
    testTimeout: 15000,
    // This machine (4 cores, 3 GB, WSL-mounted drive) can't boot more jsdom workers within
    // Vitest's 60s worker-start limit; 2 keeps the suite reliable.
    maxWorkers: 2,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})
