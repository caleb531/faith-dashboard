// This Content Security Policy (CSP) is directly passed to the helmet()
// middleware in server/index.ts
export const contentSecurityPolicy = {
  // Do not use the Helmet default CSP so that we can define our own (more
  // secure) CSP
  useDefaults: false,
  directives: {
    /* eslint-disable quotes */
    'default-src': [ "'none'" ],
    'style-src': [ "'self'", "'unsafe-inline'", 'https://fonts.googleapis.com' ],
    'font-src': [ "'self'", 'https://fonts.gstatic.com', 'data:' ],
    // Podcast thumbnails can be from any origin
    'img-src': [ '*' ],
    // https://storage.googleapis.com is required for service worker to
    // function, since it leverages the Workbox v5 CDN script
    'script-src': [ "'self'", 'https://storage.googleapis.com', "https://www.googletagmanager.com", "'unsafe-inline'", "'unsafe-eval'" ],
    'child-src': [ "'self'" ],
    'connect-src': [ "'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://www.google-analytics.com' ],
    'manifest-src': [ "'self'" ],
    // Podcast audio can be from any origin
    'media-src': [ '*' ]
    /* eslint-enable quotes */
  }
};
