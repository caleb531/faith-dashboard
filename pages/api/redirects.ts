import { NextFunction, Request, Response } from 'express';

// A regular express used for matching a www domain
const wwwRegex = /^www\./;

// Redirect www requests to non-www
export function redirectWwwToNonWww(req: Request, res: Response, next: NextFunction): void {
  if (wwwRegex.test(req.headers.host)) {
    const newHost = req.headers.host.replace(wwwRegex, '');
    return res.redirect(301, `${req.protocol}://${newHost}${req.originalUrl}`);
  }
  next();
}
