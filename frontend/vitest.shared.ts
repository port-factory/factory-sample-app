import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export const shared = defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
});
