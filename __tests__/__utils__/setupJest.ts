import AudioMock from '@tests/__mocks__/AudioMock';
import BlobMock from '@tests/__mocks__/BlobMock';
import FileReaderMock from '@tests/__mocks__/FileReaderMock';
import {
  MediaMetadataMock,
  mediaSessionMock
} from '@tests/__mocks__/mediaSessionMock';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import {
  mockSupabaseSession,
  mockSupabaseUser,
  supabaseFromMocks
} from './supabaseMockUtils';
import { Workbox } from '../__mocks__/WorkboxWindowMock';
import { resetWidgetSyncService } from '@components/widgets/widgetSyncService';

declare global {
  interface Window {
    Request: any;
    NextRequest: any;
    NextResponse: any;
  }
}

enableFetchMocks();

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
let getUserStub: jest.SpyInstance;
let getSessionStub: jest.SpyInstance;
const originalUrl = window.location.href;
const originalCreateObjectURL = URL.createObjectURL;
const originalFileReader = window.FileReader;
const originalBlob = window.Blob;
const originalServiceWorker = Object.getOwnPropertyDescriptor(
  navigator,
  'serviceWorker'
);

beforeEach(async () => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, '', originalUrl);
  document.documentElement.className = '';
  document.body.className = '';
  resetWidgetSyncService();
  Workbox.instances.length = 0;
  Object.values(supabaseFromMocks).forEach((tableMocks) => {
    Object.values(tableMocks).forEach((mock) => mock.mockReset());
  });
  fetch.mockImplementation(async (request) => {
    throw new Error(`Unexpected fetch request: ${String(request)}`);
  });
  Object.defineProperty(window, 'Blob', {
    configurable: true,
    value: BlobMock
  });
  URL.createObjectURL = jest.fn();
  jest.spyOn(window, 'FileReader').mockImplementation(() => {
    return new FileReaderMock() as FileReader;
  });
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
  if (jest.isMockFunction(supabase.from)) {
    (supabase.from as jest.Mock).mockRestore();
  }
  resetWidgetSyncService();
  Workbox.instances.length = 0;
  window.history.replaceState({}, '', originalUrl);
  document.documentElement.className = '';
  document.body.className = '';
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: originalCreateObjectURL
  });
  Object.defineProperty(window, 'FileReader', {
    configurable: true,
    value: originalFileReader
  });
  Object.defineProperty(window, 'Blob', {
    configurable: true,
    value: originalBlob
  });
  if (originalServiceWorker) {
    Object.defineProperty(navigator, 'serviceWorker', originalServiceWorker);
  } else {
    delete (navigator as any).serviceWorker;
  }
});
