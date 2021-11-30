importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// The following call will be populated automatically with the precached file
// data during the build step
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache Google fonts
workbox.routing.registerRoute(new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'), new workbox.strategies.CacheFirst({
  cacheName: 'google-fonts',
  plugins: [
    // When the cap is reached, the oldest entries are purged
    new workbox.expiration.ExpirationPlugin({
      maxEntries: 30
    }),
    // The Google Fonts CSS response is an opaque (non-CORS) response with a
    // status code of 0, so we need to enable caching for that type of response
    new workbox.cacheableResponse.CacheableResponsePlugin({
      statuses: [0, 200]
    })
  ]
}));

// When an update to the service worker is detected, the front end will request
// that the service worker be updated immediately; listen for that request here
self.addEventListener('message', (messageEvent) => {
  if (!messageEvent.data) {
    return;
  }
  if (messageEvent.data && messageEvent.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
