import { loadEnvConfig } from '@next/env';

// Load the application's environment variables before Jest executes tests
const setupEnvironment = async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

export default setupEnvironment;
