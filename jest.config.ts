import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  // Do not attempt to test utility functions, since they themselves aren't
  // tests
  testPathIgnorePatterns: [
    '/__utils__/'
  ],
  // Do not attempt to transform lodash-es, since it uses native ES6 modules
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!lodash-es)'
  ]
};
export default config;
