import { getSupabaseServerClient } from '@components/authUtils.server';

import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  const formData = await request.formData();

  const response = await supabase.auth.setSession({
    access_token: String(formData.get('access_token')),
    refresh_token: String(formData.get('refresh_token'))
  });

  return NextResponse.json(response);
}
