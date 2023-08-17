import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();

  const response = await supabase.auth.resetPasswordForEmail(
    String(formData.get('email')),
    {
      redirectTo: `${requestUrl.origin}/reset-password`
    }
  );

  return NextResponse.json(response);
}
