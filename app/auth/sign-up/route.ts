import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });

  const response = await supabase.auth.signUp({
    email: String(formData.get('email')),
    password: String(formData.get('password')),
    options: {
      data: {
        first_name: String(formData.get('first_name')),
        last_name: String(formData.get('last_name'))
      },
      emailRedirectTo: `${requestUrl.origin}/api/callback`
    }
  });

  if (response.error) {
    console.error(response.error);
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-up?error=${response.error.message}`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301
      }
    );
  }

  return NextResponse.redirect(requestUrl.origin, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301
  });
}
