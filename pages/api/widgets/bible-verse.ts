import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const API_BASE_URL = 'https://api.esv.org/v3/passage/html/';

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (!process.env.ESV_API_KEY) {
    res.status(500);
    res.json({ error: 'Missing API key' });
    return;
  }

  if (!req.query.q) {
    res.status(400);
    res.json({ error: 'Missing parameter: q' });
    return;
  }

  const params = new URLSearchParams({
    'q': String(req.query.q),
    // The ESV API requires that all of these values are strings (either
    // 'true' or 'false')
    'include-footnotes': 'false',
    'include-footnote-body': 'false',
    'include-chapter-numbers': 'false',
    'include-verse-numbers': 'false',
    'include-first-verse-numbers': 'false',
    'include-headings': 'false',
    'include-subheadings': 'false',
    'include-audio-link': 'false'
  });
  const response = await fetch(`${API_BASE_URL}?${params}`, {
    headers: { 'Authorization': `Token ${process.env.ESV_API_KEY}` }
  });
  const data = await response.json();

  res.status(response.status);
  res.json(data);

};
