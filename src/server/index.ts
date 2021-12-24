import compression from 'compression';
import express from 'express';
import expressEnforcesSSL from 'express-enforces-ssl';
import helmet from 'helmet';
import { AddressInfo } from 'net';
import path from 'path';
import routeBibleVerseSearch from './widgets/widget-BibleVerse/search';
import routePodcastSearch from './widgets/widget-Podcast/search';

// Express server

const app = express();

// Force HTTPS on production
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(expressEnforcesSSL());
  app.use(helmet());
}

// Serve assets using gzip compression
app.use(compression());

// Routes

routeBibleVerseSearch(app);
routePodcastSearch(app);
app.use(express.static(path.dirname(__dirname)));

// HTTP server wrapper

const listener = app.listen(process.env.PORT || 8080, () => {
  const addressInfo = listener.address() as AddressInfo;
  console.log(`Server started. Listening on port ${addressInfo.port}`);
});

export default app;
