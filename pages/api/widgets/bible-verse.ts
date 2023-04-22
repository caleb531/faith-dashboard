import { NextApiRequest, NextApiResponse } from 'next';
import { fetchReferenceContent } from 'youversion-suggest';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.q) {
    res.status(400);
    res.json({ error: 'Missing parameter: q' });
    return;
  }
  try {
    const reference = await fetchReferenceContent(String(req.query.q), {
      language: 'eng',
      fallbackVersion: 'esv'
    });

    res.status(200);
    res.json(reference);
  } catch (error) {
    res.status(500);
    res.json({
      error: error instanceof Error ? error.message : 'Internal Error'
    });
  }
};
