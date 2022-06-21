import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const API_BASE_URL = 'https://itunes.apple.com/search';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.q) {
    res.status(400);
    res.json({ error: 'Missing parameter: q' });
    return;
  }

  const params = new URLSearchParams({
    term: String(req.query.q),
    entity: 'podcast'
  });
  const response = await fetch(`${API_BASE_URL}?${params}`);
  const data = await response.json();

  res.status(response.status);
  res.json(data);
};
