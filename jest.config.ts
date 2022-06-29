import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  // Do not attempt to test utility functions, since they themselves aren't
  // tests
  testPathIgnorePatterns: ['/__utils__/'],
  // Do not attempt to transform lodash-es, since it uses native ES6 modules
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
  // Enable Jest to compile TypeScript/JSX using Next's built-in Babel preset
  // (rather than creating a .babelrc config, which will cause NextJS to use
  // Babel instead of the much-faster SVC for building the project)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  }
};
export default config;
