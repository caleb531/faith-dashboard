const path = require('path');
const runtimeCaching = require('next-pwa/cache');

/** @type {import('next-pwa').PWAConfig} */
const withPWA = require('next-pwa')({
  // The destination directory of the generated service worker
  dest: 'public',
  // The name of the generated service worker
  sw: 'service-worker.js',
  // Do not automatically register the service worker; we take care of that
  // manually in UpdateNotification.tsx
  register: false,
  // Disable service worker generation in development mode
  // (source: https://stackoverflow.com/a/67124165/560642)
  disable: process.env.NODE_ENV === 'development',
  // Enable app to reload service worker when clicking update banner; per the
  // documentation on Workbox's GenerateSW class: "[If true, then] add an
  // unconditional call to skipWaiting() to the generated service worker. If
  // false, then a message listener will be added instead, allowing you to
  // conditionally call skipWaiting() by posting a message containing {type:
  // 'SKIP_WAITING'}." (source:
  // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW#GenerateSW)
  skipWaiting: false,
  runtimeCaching: [
    // Fix bad-precaching-response errors from service worker due to use of
    // middleware (source: https://github.com/shadowwalker/next-pwa/issues/291)
    ...runtimeCaching
  ],
  buildExcludes: [
    // This is necessary to prevent service worker errors; see
    // <https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1399683017>
    /app-build-manifest\.json$/,
    /middleware-manifest\.json$/,
    /middleware-runtime\.js$/,
    /_middleware\.js$/
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  async headers() {
    const headers = [
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      }
    ];
    if (process.env.NODE_ENV === 'production') {
      // The HSTS header should only be sent for HTTPS websites; because
      // localhost is server over plain HTTP, we do not want to enable HSTS
      // there
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=15552000; includeSubDomains'
      });
    }
    return [{ source: '/:path*', headers }];
  }
});

module.exports = nextConfig;
