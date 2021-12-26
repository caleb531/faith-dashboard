import compression from 'compression';
import express from 'express';
import expressEnforcesSSL from 'express-enforces-ssl';
import helmet from 'helmet';
import { AddressInfo } from 'net';
import path from 'path';
import routeBibleVerse from './widgets/widget-BibleVerse/bible-verse';
import routePodcastFeed from './widgets/widget-Podcast/feed';
import routePodcast from './widgets/widget-Podcast/podcast';

// Express server

const app = express();

// Force HTTPS on production
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(expressEnforcesSSL());
}
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      /* eslint-disable quotes */
      'default-src': [ "'none'" ],
      'style-src': [ "'self'", "'unsafe-inline'", 'https://fonts.googleapis.com' ],
      'font-src': [ "'self'", 'https://*.gstatic.com', 'data:' ],
      // Podcast thumbnails can be from any origin
      'img-src': [ '*' ],
      // https://storage.googleapis.com is required for service worker to
      // function, since it leverages the Workbox v5 CDN script
      'script-src': [ "'self'", 'https://storage.googleapis.com', "'unsafe-eval'" ],
      'child-src': [ "'self'" ],
      'connect-src': [ "'self'", 'https://fonts.googleapis.com', 'https://*.gstatic.com' ],
      'manifest-src': [ "'self'" ],
      // Podcast audio can be from any origin
      'media-src': [ '*' ]
      /* eslint-enable quotes */
    }
  }
}));

// Serve assets using gzip compression
app.use(compression());

// Routes

routeBibleVerse(app);
routePodcast(app);
routePodcastFeed(app);
app.use(express.static(path.dirname(__dirname)));

// HTTP server wrapper

const listener = app.listen(process.env.PORT || 8080, () => {
  const addressInfo = listener.address() as AddressInfo;
  console.log(`Server started. Listening on port ${addressInfo.port}`);
});

export default app;
