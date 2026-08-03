import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';
import { defineConfig } from 'vitest/config';

// Resolve project-relative aliases without relying on CommonJS globals
const rootDir = fileURLToPath(new URL('.', import.meta.url));
// Load once in the config process, then pass the values directly to each worker
Object.assign(process.env, { NODE_ENV: 'test' });
nextEnv.loadEnvConfig(rootDir);
const testEnvironment = { ...process.env };

export default defineConfig({
  resolve: {
    alias: {
      '@app': `${rootDir}app`,
      '@components': `${rootDir}components`,
      '@public': `${rootDir}public`,
      '@styles': `${rootDir}styles`,
      '@tests': `${rootDir}__tests__`,
      'next/link': `${rootDir}__tests__/__mocks__/LinkMock.tsx`,
      'next/headers': `${rootDir}__tests__/__mocks__/nextHeaders.ts`,
      'next/server': `${rootDir}__tests__/__mocks__/nextServer.ts`,
      'next/navigation': `${rootDir}__tests__/__mocks__/nextNavigation.ts`,
      'workbox-window': `${rootDir}__tests__/__mocks__/WorkboxWindowMock.ts`,
      '@supabase/ssr': `${rootDir}__tests__/__mocks__/supabaseAuthHelpersMock.ts`,
      '../../public/images/help/ios-add-to-home-screen-ios-1.jpg': `${rootDir}__tests__/__mocks__/imageMock.ts`,
      '../../public/images/help/ios-add-to-home-screen-ios-2.jpg': `${rootDir}__tests__/__mocks__/imageMock.ts`,
      '../../public/images/help/ios-add-to-home-screen-ios-3.jpg': `${rootDir}__tests__/__mocks__/imageMock.ts`
    }
  },
  test: {
    environment: 'jsdom',
    // Reuse VM contexts within worker threads while preserving per-file isolation
    pool: 'vmThreads',
    env: testEnvironment,
    globals: true,
    setupFiles: [`${rootDir}__tests__/__utils__/setupVitest.ts`],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    exclude: ['**/__utils__/**', '**/__mocks__/**'],
    sequence: {
      // Run suite hooks in declaration order, matching Jest's hook semantics
      hooks: 'list'
    },
    server: {
      deps: {
        inline: [
          'goatcounter-js'
        ]
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'json', 'lcov', 'html', 'text', 'text-summary'],
      exclude: ['__tests__/__utils__/**', '__tests__/__mocks__/**']
    }
  }
});
