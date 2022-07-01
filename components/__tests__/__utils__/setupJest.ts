import fetch, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

beforeEach(() => {
  fetch.mockResponse(JSON.stringify({}));
});
afterEach(() => {
  fetch.resetMocks();
  localStorage.clear();
});
