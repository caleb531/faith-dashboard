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
      captchaToken: String(formData.get('cf-turnstile-response')),
      data: {
        first_name: String(formData.get('first_name')),
        last_name: String(formData.get('last_name'))
      }
    }
  });

  return NextResponse.json(response);
}
