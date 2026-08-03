import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';

// Share one enabled fetch mock between the common setup and individual suites
const fetch = createFetchMock(vi);

fetch.enableMocks();

export default fetch;
