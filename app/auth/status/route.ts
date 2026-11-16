import { getAuth } from '@components/authUtils.server';
import { AUTH_RECOVERY_TIMEOUT_MS } from '@components/authUtils.shared';
import { NextResponse } from 'next/server';

// Session verification must run for each visitor rather than being cached
export const dynamic = 'force-dynamic';

// Allow a longer verification after the dashboard has already loaded
export async function GET() {
  // Only server-verified user data is returned to the frontend
  const auth = await getAuth(AUTH_RECOVERY_TIMEOUT_MS);
  return NextResponse.json(auth, {
    headers: { 'Cache-Control': 'private, no-store' }
  });
}
