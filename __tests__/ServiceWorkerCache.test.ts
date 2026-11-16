import { shouldBypassRuntimeCache } from '@components/serviceWorkerCache';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import nextPWA from 'next-pwa';
import '../next.config';

// Inspect the PWA options without starting Webpack or generating any files
jest.mock('next-pwa', () => ({
  __esModule: true,
  default: jest.fn(() => (config: unknown) => config)
}));

describe('Service-worker authentication caching', () => {
  it.each([
    'https://app.test/auth/status',
    'https://app.test/auth/callback?code=example',
    'https://app.test/auth',
    'https://app.test/api/auth/session',
    'https://project.supabase.co/auth/v1/user',
    'https://app.test/account?_rsc=example',
    'https://app.test/_next/data/build/account.json'
  ])('never caches authentication or page-data requests to %s', (address) => {
    // Use real headers and URLs as Workbox does when selecting a route
    const request = new Request(address);
    expect(shouldBypassRuntimeCache({ request, url: new URL(address) })).toBe(
      true
    );
  });

  it('never caches a navigation, including the personalized start URL', () => {
    // The navigate mode is assigned by the browser rather than Request's API
    const request = new Request('https://app.test/');
    Object.defineProperty(request, 'mode', { value: 'navigate' });
    expect(
      shouldBypassRuntimeCache({ request, url: new URL(request.url) })
    ).toBe(true);
  });

  it('never caches authenticated database requests on another origin', () => {
    // Account-specific responses can share a URL across different users
    const request = new Request(
      'https://project.supabase.co/rest/v1/dashboards',
      {
        headers: { Authorization: 'Bearer synthetic-token' }
      }
    );
    expect(
      shouldBypassRuntimeCache({ request, url: new URL(request.url) })
    ).toBe(true);
  });

  it('never caches React Server Component responses without a query parameter', () => {
    // Next.js also identifies personalized page-data requests with this header
    const request = new Request('https://app.test/account', {
      headers: { RSC: '1' }
    });
    expect(
      shouldBypassRuntimeCache({ request, url: new URL(request.url) })
    ).toBe(true);
  });

  it.each([
    'https://app.test/_next/static/chunks/app.js',
    'https://app.test/icons/account-light.svg',
    'https://app.test/images/background.jpg',
    'https://app.test/api/widgets/bible-verse',
    'https://feeds.test/podcast.xml'
  ])('preserves existing public asset and feed caching for %s', (address) => {
    // Public resources still use the unchanged default runtime-cache rules
    const request = new Request(address);
    expect(shouldBypassRuntimeCache({ request, url: new URL(address) })).toBe(
      false
    );
  });

  it('places the network-only policy ahead of defaults and disables the start-URL override', () => {
    // These are the actual options supplied by the production Next.js config
    const options = jest.mocked(nextPWA).mock.calls[0][0]!;
    expect(options.runtimeCaching![0]).toEqual({
      urlPattern: shouldBypassRuntimeCache,
      handler: 'NetworkOnly'
    });
    expect(options.cacheStartUrl).toBe(false);
    expect(options.dynamicStartUrl).toBe(false);
    expect(options.importScripts).toContain(
      '/service-worker-auth-cache-cleanup.js'
    );
  });

  it('removes legacy sensitive caches during activation and retains static assets', async () => {
    // Model existing Cache Storage entries left by previous worker versions
    const cacheNames = new Set([
      'start-url',
      'others',
      'next-data',
      'apis',
      'cross-origin',
      'static-data-assets',
      'static-js-assets',
      'static-image-assets',
      'static-audio-assets',
      'workbox-precache-v2'
    ]);
    // Capture the real cleanup script's activation listener
    const addEventListener = jest.fn();
    // Delete only the caches selected by the worker's migration
    const deleteCache = jest.fn(async (name: string) =>
      cacheNames.delete(name)
    );
    // The worker must finish cleanup before activation completes
    const waitUntil = jest.fn();
    runInNewContext(
      readFileSync('public/service-worker-auth-cache-cleanup.js', 'utf8'),
      { self: { addEventListener }, caches: { delete: deleteCache } }
    );
    expect(addEventListener).toHaveBeenCalledWith(
      'activate',
      expect.any(Function)
    );
    addEventListener.mock.calls[0][1]({ waitUntil });
    await waitUntil.mock.calls[0][0];
    expect(cacheNames).toEqual(
      new Set([
        'static-js-assets',
        'static-image-assets',
        'static-audio-assets',
        'workbox-precache-v2'
      ])
    );
  });
});
