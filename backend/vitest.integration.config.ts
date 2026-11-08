import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/integration/**/*.test.ts'],
    // Integration tests share one database, so run files serially.
    fileParallelism: false,
    testTimeout: 15_000,
  },
});
