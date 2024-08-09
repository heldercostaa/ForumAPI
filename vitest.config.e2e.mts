import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['**/*.e2e-spec.ts'],

    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],

    reporters: ['verbose'],
    outputFile: 'coverage/junit.xml',
    coverage: {
      provider: 'v8',
      include: ['src/services', 'src/http', 'src/repositories/prisma'],
    },
  },
});
