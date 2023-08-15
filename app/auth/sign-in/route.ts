import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });
  // If no redirectTo parameter is specified, redirect to the user's dashboard
  // (i.e. the homepage)
  const pathToRedirectTo = requestUrl.searchParams.get('redirect_to') ?? '/';

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email')),
    password: String(formData.get('password'))
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=${error.message}`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301
      }
    );
  }

  // A 301 status is required to redirect from a POST to a GET route
  return NextResponse.redirect(`${requestUrl.origin}${pathToRedirectTo}`, {
    status: 301
  });
}
