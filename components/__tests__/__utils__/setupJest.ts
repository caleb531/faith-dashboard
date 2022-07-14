import { configure } from '@testing-library/dom';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import AudioMock from '../__mocks__/AudioMock';
import {
  MediaMetadataMock,
  mediaSessionMock
} from '../__mocks__/mediaSessionMock';

// Increase timeout of React Testing Library's waitFor() function, as well as
// Jest's global max timeout; this is an attempt to resolve the 'Unable to find
// role' error when running tests on CI (even though all tests pass locally)
configure({ asyncUtilTimeout: 5000 });
jest.setTimeout(10000);

enableFetchMocks();
jest.mock('../../supabaseClient');

jest.mock('../../useVerifyCaptcha', () => {
  return jest.fn().mockImplementation(() => {
    return [
      () => {
        // noop
      },
      () => {
        // noop
      }
    ];
  });
});

let audioStub: jest.SpyInstance;
let originalMediaMetadata: typeof window.MediaMetadata;
let originalMediaSession: typeof navigator.mediaSession;

beforeEach(() => {
  audioStub = jest.spyOn(window, 'Audio').mockImplementation(() => {
    return new AudioMock() as any;
  });
  if (typeof navigator !== 'undefined') {
    originalMediaSession = navigator.mediaSession;
    originalMediaMetadata = window.MediaMetadata;
    Object.defineProperty(navigator, 'mediaSession', {
      configurable: true,
      writable: false,
      value: mediaSessionMock
    });
    window.MediaMetadata = MediaMetadataMock;
  }
});
afterEach(() => {
  fetch.resetMocks();
  audioStub.mockRestore();
  AudioMock.instances.length = 0;
  localStorage.clear();
  Object.defineProperty(navigator, 'mediaSession', {
    value: originalMediaSession
  });
  window.MediaMetadata = originalMediaMetadata;
});
