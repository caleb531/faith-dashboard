import { configure } from '@testing-library/dom';
import AudioMock from '@tests/__mocks__/AudioMock';
import BlobMock from '@tests/__mocks__/BlobMock';
import FileReaderMock from '@tests/__mocks__/FileReaderMock';
import {
  MediaMetadataMock,
  mediaSessionMock
} from '@tests/__mocks__/mediaSessionMock';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import { SpyInstance } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { mockSupabaseSession, mockSupabaseUser } from './supabaseMockUtils';

declare global {
  interface Window {
    Request: any;
    NextRequest: any;
    NextResponse: any;
  }
}

// Increase timeout of React Testing Library's waitFor() function, as well as
// Jest's global max timeout; this is an attempt to resolve the 'Unable to find
// role' error when running tests on CI (even though all tests pass locally)
configure({ asyncUtilTimeout: 10000 });

const fetch = createFetchMock(vi);
fetch.enableMocks();

vi.mock('../../components/useVerifyCaptcha', () => {
  return vi.fn().mockImplementation(() => {
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

let audioStub: SpyInstance;
let onAuthStateChangeStub: SpyInstance;
let originalMediaMetadata: typeof window.MediaMetadata;
let originalMediaSession: typeof navigator.mediaSession;
let getUserStub: SpyInstance;
let getSessionStub: SpyInstance;

beforeEach(async () => {
  localStorage.clear();
  Object.defineProperty(window, 'Blob', {
    configurable: true,
    value: BlobMock
  });
  URL.createObjectURL = vi.fn();
  vi.spyOn(window, 'FileReader').mockImplementation(() => {
    return new FileReaderMock() as FileReader;
  });
  audioStub = vi.spyOn(window, 'Audio').mockImplementation(() => {
    return new AudioMock() as any;
  });
  onAuthStateChangeStub = vi
    .spyOn(supabase.auth, 'onAuthStateChange')
    .mockImplementation(() => {
      return { data: { subscription: { unsubscribe: vi.fn() } as any } };
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
  getUserStub = await mockSupabaseUser(null);
  getSessionStub = await mockSupabaseSession(null);
});
afterEach(async () => {
  fetch.resetMocks();
  audioStub.mockRestore();
  FileReaderMock._fileData = '';
  AudioMock.instances.length = 0;
  onAuthStateChangeStub.mockRestore();
  Object.defineProperty(navigator, 'mediaSession', {
    value: originalMediaSession
  });
  window.MediaMetadata = originalMediaMetadata;
  getUserStub.mockRestore();
  getSessionStub.mockRestore();
});
