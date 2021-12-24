import { Express } from 'express';
// node-fetch v2 is required since TypeScript is compiling these ES6 import
// calls to require() calls
import fetch from 'node-fetch';
import apiInfo from './api-credentials';

export default function (app: Express): void {
  app.get('/widgets/bible-verse/get-verse/:query', async (req, res) => {

    const API_BASE_URL = 'https://api.esv.org/v3/passage/html/';

    if (!apiInfo) {
      res.status(500);
      res.json({ error: 'API key is missing' });
    }

    const params = {
      'q': req.params.query,
      'include-footnotes': 'false',
      'include-footnote-body': 'false',
      'include-chapter-numbers': 'false',
      'include-verse-numbers': 'false',
      'include-first-verse-numbers': 'false',
      'include-headings': 'false',
      'include-subheadings': 'false',
      'include-audio-link': 'false'
    };
    const paramsStr = new URLSearchParams(params).toString();
    console.log(req.params.query);
    console.log(paramsStr);
    const response = await fetch(`${API_BASE_URL}?${paramsStr}`, {
      headers: { 'Authorization': `Token ${apiInfo.api_token}` }
    });
    const data = await response.json();

    res.status(response.status);
    res.json(data);

  });
}
