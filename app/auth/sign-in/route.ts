import { getSupabaseServerClient } from '@components/authUtils.server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const supabase = getSupabaseServerClient();

  const response = await supabase.auth.signInWithPassword({
    email: String(formData.get('email')),
    password: String(formData.get('password')),
    options: {
      captchaToken: String(formData.get('cf-turnstile-response'))
    }
  });

  return NextResponse.json(response);
}
