import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  // File to automatically import for each test suite
  globalSetup: '<rootDir>/__tests__/__utils__/setupEnv.ts',
  setupFilesAfterEnv: ['<rootDir>/__tests__/__utils__/setupJest.ts'],
  // Do not attempt to test utility functions, since they themselves aren't
  // tests
  testPathIgnorePatterns: ['/__utils__/', '/__mocks__/'],
  coveragePathIgnorePatterns: ['/__utils__/', '/__mocks__/'],
  // Do not attempt to transform lodash-es, since it uses native ES6 modules
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!.*/lodash-es)'],
  // Enable Jest to compile TypeScript/JSX using Next's built-in Babel preset
  // (rather than creating a .babelrc config, which will cause NextJS to use
  // Babel instead of the much-faster SVC for building the project)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  // Mock the NextJS <Link> component (next/link) to prevent act() errors when
  // running some asynchronous tests; this is because next/link will
  // automatically prefetch the target page when the link is in view, and this
  // prefetching causes the <Link> component to re-render (which confuses React
  // Testing Library); to solve this, we mock the <Link> component entirely so
  // as to eliminate the possibility of re-rendering
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    'next/link': require.resolve('./__tests__/__mocks__/LinkMock.tsx'),
    'next/headers': require.resolve('./__tests__/__mocks__/nextHeaders.ts'),
    'next/navigation': require.resolve(
      './__tests__/__mocks__/nextNavigation.ts'
    ),
    'workbox-window': require.resolve(
      './__tests__/__mocks__/WorkboxWindowMock.ts'
    ),
    '@supabase/auth-helpers-nextjs': require.resolve(
      './__tests__/__mocks__/supabaseAuthHelpersMock.ts'
    ),
    '(.*).(jpg|png|svg)$': require.resolve('./__tests__/__mocks__/imageMock.ts')
  },
  // Display coverage summary below file-by-file coverage breakdown
  coverageReporters: ['clover', 'json', 'lcov', 'html', 'text', 'text-summary']
};
export default config;
