import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  // File to automatically import for each test suite
  globalSetup: '<rootDir>/components/__tests__/__utils__/setupEnv.ts',
  setupFilesAfterEnv: ['<rootDir>/components/__tests__/__utils__/setupJest.ts'],
  // Do not attempt to test utility functions, since they themselves aren't
  // tests
  testPathIgnorePatterns: ['/__utils__/', '/__mocks__/'],
  coveragePathIgnorePatterns: ['/__utils__/', '/__mocks__/'],
  // Do not attempt to transform lodash-es, since it uses native ES6 modules
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
  // Enable Jest to compile TypeScript/JSX using Next's built-in Babel preset
  // (rather than creating a .babelrc config, which will cause NextJS to use
  // Babel instead of the much-faster SVC for building the project)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  // Display coverage summary below file-by-file coverage breakdown
  coverageReporters: ['clover', 'json', 'lcov', 'html', 'text', 'text-summary']
};
export default config;
