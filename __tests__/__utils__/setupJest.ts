import { configure } from '@testing-library/dom';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { supabase } from '../../components/supabaseClient';
import AudioMock from '../__mocks__/AudioMock';
import FileReaderMock from '../__mocks__/FileReaderMock';
import {
  MediaMetadataMock,
  mediaSessionMock
} from '../__mocks__/mediaSessionMock';

// Increase timeout of React Testing Library's waitFor() function, as well as
// Jest's global max timeout; this is an attempt to resolve the 'Unable to find
// role' error when running tests on CI (even though all tests pass locally)
configure({ asyncUtilTimeout: 10000 });
jest.setTimeout(20000);

enableFetchMocks();
jest.mock('../../components/supabaseClient');

jest.mock('../../components/useVerifyCaptcha', () => {
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
let onAuthStateChangeStub: jest.SpyInstance;
let originalMediaMetadata: typeof window.MediaMetadata;
let originalMediaSession: typeof navigator.mediaSession;

beforeEach(() => {
  localStorage.clear();
  audioStub = jest.spyOn(window, 'Audio').mockImplementation(() => {
    return new AudioMock() as any;
  });
  onAuthStateChangeStub = jest
    .spyOn(supabase.auth, 'onAuthStateChange')
    .mockImplementation(() => {
      return { data: { subscription: { unsubscribe: jest.fn() } as any } };
    });
  if (typeof navigator !== 'undefined') {
    originalMediaSession = navigator.mediaSession;
    originalMediaMetadata = window.MediaMetadata;
    Object.defineProperty(navigator, 'mediaSession', {
      configurable: true,
      value: mediaSessionMock
    });
    window.MediaMetadata = MediaMetadataMock;
  }
});
afterEach(() => {
  fetch.resetMocks();
  audioStub.mockRestore();
  FileReaderMock._fileData = '';
  AudioMock.instances.length = 0;
  onAuthStateChangeStub.mockRestore();
  Object.defineProperty(navigator, 'mediaSession', {
    value: originalMediaSession
  });
  window.MediaMetadata = originalMediaMetadata;
});
