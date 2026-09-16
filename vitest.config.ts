import { defineConfig } from 'vitest/config';
import path from 'node:path';
export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  test: { environment: 'node', include: ['tests/**/*.test.{ts,tsx}'], testTimeout: 15000, hookTimeout: 60000, fileParallelism: false },
});
