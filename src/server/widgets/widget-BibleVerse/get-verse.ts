import { Express } from 'express';
import apiInfo from './api-credentials';

export default function (app: Express): void {

  app.get('/widgets/bible-verse/get-verse', (req, res) => {

    const API_BASE_URL = 'https://api.esv.org/v3/passage/html/?';

    if (!apiInfo) {
      res.json({ error: 'API key is missing' });
      res.status(500);
    }

    res.json({ success: true });
    res.status(200);

  });

}
