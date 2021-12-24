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
  app.use(helmet());
}

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
