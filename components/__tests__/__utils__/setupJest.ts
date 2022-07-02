import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import podcastSearchJson from '../__json__/podcastSearch.json';

enableFetchMocks();

let pauseStub: jest.SpyInstance;

beforeEach(() => {
  fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
  pauseStub = jest
    .spyOn(window.HTMLMediaElement.prototype, 'pause')
    .mockImplementation(() => {
      /* noop */
    });
});
afterEach(() => {
  fetch.resetMocks();
  pauseStub.mockRestore();
  localStorage.clear();
});
