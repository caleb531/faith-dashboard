import { NextRequest, NextResponse } from 'next/server';

// Force-redirect plain HTTP to HTTPS
export function middleware(req: NextRequest) {
  if (
    process.env.NODE_ENV === 'production'
    &&
    req.headers.get('x-forwarded-proto') !== 'https'
    &&
    req.nextUrl.hostname !== 'localhost'
  ) {
    return NextResponse.redirect(
      `https://${req.nextUrl.host}${req.nextUrl.pathname}`,
      301
    );
  }
  return NextResponse.next();
}
