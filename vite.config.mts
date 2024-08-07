import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [
      ['src/http/controllers/**', './vitest-environments/prisma.ts'],
    ],

    reporters: ['verbose'],
    outputFile: 'coverage/junit.xml',
    coverage: {
      provider: 'v8',
      include: ['src/services', 'src/http', 'src/repositories/prisma'],
    },
  },
});
