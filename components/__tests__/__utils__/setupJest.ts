import { configure } from '@testing-library/dom';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import podcastSearchJson from '../__json__/podcastSearch.json';
import AudioMock from '../__mocks__/Audio';

// Increase timeout of React Testing Library's waitFor() function, as well as
// Jest's global max timeout; this is an attempt to resolve the 'Unable to find
// role' error when running tests on CI (even though all tests pass locally)
configure({ asyncUtilTimeout: 5000 });
jest.setTimeout(10000);

enableFetchMocks();

let audioStub: jest.SpyInstance;

beforeEach(() => {
  fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
  audioStub = jest.spyOn(window, 'Audio').mockImplementation(() => {
    return new AudioMock() as any;
  });
});
afterEach(() => {
  fetch.resetMocks();
  audioStub.mockRestore();
  localStorage.clear();
});
