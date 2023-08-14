import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from './components/databaseSchema.types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Ensure that the user's session remains active by refreshing the user's
  // session before loading a Server Component route (source:
  // <https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware>)
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();
  // Set the request URL in the headers so it can be accessed from a Server
  // Component (source: <https://stackoverflow.com/a/75363135/560642>)
  res.headers.set('x-url', req.url);
  return res;
}
