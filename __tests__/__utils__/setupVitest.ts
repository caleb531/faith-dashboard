import AudioMock from '@tests/__mocks__/AudioMock';
import BlobMock from '@tests/__mocks__/BlobMock';
import FileReaderMock from '@tests/__mocks__/FileReaderMock';
import {
  MediaMetadataMock,
  mediaSessionMock
} from '@tests/__mocks__/mediaSessionMock';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import '@testing-library/jest-dom/vitest';
import fetch from './fetchMock';
import { vi, type Mock, type MockInstance } from 'vitest';
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

vi.mock('../../components/useVerifyCaptcha', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return [
        () => {
          // noop
        },
        () => {
          // noop
        }
      ];
    })
  };
});

let audioStub: Pick<MockInstance, 'mockRestore'>;
let onAuthStateChangeStub: Pick<MockInstance, 'mockRestore'>;
let originalMediaMetadata: typeof window.MediaMetadata;
let originalMediaSession: typeof navigator.mediaSession;
let getUserStub: Pick<MockInstance, 'mockRestore'>;
let getSessionStub: Pick<MockInstance, 'mockRestore'>;
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
  URL.createObjectURL = vi.fn();
  vi.spyOn(window, 'FileReader').mockImplementation(function () {
    return new FileReaderMock() as FileReader;
  });
  audioStub = vi.spyOn(window, 'Audio').mockImplementation(function () {
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
  if (vi.isMockFunction(supabase.from)) {
    (supabase.from as Mock).mockRestore();
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
