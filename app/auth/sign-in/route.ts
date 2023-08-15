import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const redirectTo = requestUrl.searchParams.get('redirect_to');
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error(error);
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=${error.message}`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301
      }
    );
  }

  if (redirectTo) {
    // A 301 status is required to redirect from a POST to a GET route
    return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`, {
      status: 301
    });
  } else {
    return NextResponse.redirect(requestUrl.origin, { status: 301 });
  }
}
