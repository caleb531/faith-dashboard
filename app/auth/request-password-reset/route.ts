import { getSupabaseServerClient } from '@components/authUtils.server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = getSupabaseServerClient();
  const formData = await request.formData();

  const response = await supabase.auth.resetPasswordForEmail(
    String(formData.get('email')),
    {
      redirectTo: `${requestUrl.origin}/reset-password`,
      captchaToken: String(formData.get('cf-turnstile-response'))
    }
  );

  return NextResponse.json(response);
}
