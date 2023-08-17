import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();

  const response = await supabase.auth.setSession({
    access_token: String(formData.get('access_token')),
    refresh_token: String(formData.get('refresh_token'))
  });

  return NextResponse.json(response);
}
