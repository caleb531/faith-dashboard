// Old runtime caches may contain session tokens or personalized page responses
const legacyAuthCacheNames = [
  'start-url',
  'others',
  'next-data',
  'apis',
  'cross-origin',
  'static-data-assets'
];

// Remove old auth-bearing responses before the updated worker handles requests
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all(legacyAuthCacheNames.map((name) => caches.delete(name)))
  );
});
