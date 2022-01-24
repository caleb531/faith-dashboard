import { NextRequest, NextResponse } from 'next/server';

// Force-redirect a plain HTTP pagw request to HTTPS
function forceHTTPS(req: NextRequest) {
  if (process.env.NODE_ENV === 'production' &&
    req.headers.get('x-forwarded-proto') !== 'https'
    &&
    req.nextUrl.hostname !== 'localhost'
  ) {
    return NextResponse.redirect(
      `https://${req.nextUrl.host}${req.nextUrl.pathname}`,
      301
    );
  }
}

// Redirect a www page request to the non-www equivalent
function redirectWwwToNonWww(req: NextRequest) {
  const host = String(req.nextUrl.host);
  const wwwRegex = /^www\./;
  if (wwwRegex.test(host)) {
    const newHost = host.replace(wwwRegex, '');
    return NextResponse.redirect(`http://${newHost}`, 301);
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
