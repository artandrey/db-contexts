import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 15000,
    hookTimeout: 25000,
  },
  resolve: {
    alias: {
      '~core': resolve(__dirname, './src/core'),
      '~modules': resolve(__dirname, './src/modules'),
    },
  },
});
