import { NextRequest, NextResponse } from 'next/server';

// Force-redirect every HTTP request to HTTPS
function forceHTTPS(req: NextRequest) {
  if (process.env.NODE_ENV === 'production' &&
    req.headers.get('x-forwarded-proto') !== 'https'
    &&
    // This check prevents us from getting trapped in HTTPS localhost if we are
    // testing a production build locally via `next build && next start`; we
    // can use `req.headers.get('host')` to get the true host (e.g.
    // 'faithdashboard.com'), whereas `req.nextUrl.host` is always
    // 'localhost:3000'
    !req.headers.get('host').includes('localhost')
  ) {
    return NextResponse.redirect(
      `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
      301
    );
  }
}

// Redirect every www request to the non-www equivalent
function redirectWwwToNonWww(req: NextRequest) {
  const host = req.headers.get('host');
  const wwwRegex = /^www\./;
  if (wwwRegex.test(host)) {
    const newHost = host.replace(wwwRegex, '');
    if (req.headers.get('host').includes('localhost')) {
      // If we are running a production build locally, still redirect to
      // non-www, but stay on HTTP because we are on localhost
      return NextResponse.redirect(`http://${newHost}`, 301);
    } else {
      // Otherwise, if the client is on a non-localhost domain (e.g.
      // faithdashboard.com), then redirect directly to HTTPS in addition to
      // redirecting to non-www
      return NextResponse.redirect(`https://${newHost}`, 301);
    }
  }
}

// Sequentially process an array of middleware functions (this function is to
// avoid repetition and produce cleaner code)
function processMiddlewareFunctions(req: NextRequest, middlewareFns: Function[]) {
  for (const middlewareFn of middlewareFns) {
    const fnResponse = middlewareFn(req);
    if (fnResponse) {
      return fnResponse;
    }
  }
  return NextResponse.next();
}

export function middleware(req: NextRequest) {
  return processMiddlewareFunctions(req, [
    forceHTTPS,
    redirectWwwToNonWww
  ]);
}
