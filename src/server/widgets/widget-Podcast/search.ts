import { Express } from 'express';
import fetch from 'node-fetch';

const API_BASE_URL = 'https://itunes.apple.com/search';

export default function (app: Express): void {
  app.get('/widgets/podcast/search/:query', async (req, res) => {

    const params = new URLSearchParams({
      'term': req.params.query,
      'entity': 'podcast'
    });
    const response = await fetch(`${API_BASE_URL}?${params}`);
    const data = await response.json();

    res.status(response.status);
    res.json(data);

  });
}
