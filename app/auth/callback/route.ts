import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@components/authUtils.server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect_to') ?? '';

  if (code) {
    const supabase = getSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
  } else {
    // URL to redirect to after sign in process completes (with error message)
    return NextResponse.redirect(
      `${requestUrl.origin}${redirectTo}#message=${encodeURIComponent(
        'There was an error confirming your email. Please contact support at support@faithdashboard.com'
      )}`
    );
  }
}
