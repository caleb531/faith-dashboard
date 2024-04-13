import { getSupabaseServerClient } from '@components/authUtils.server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const formData = await request.formData();

  const response = await supabase.auth.updateUser({
    email: String(formData.get('new_email'))
  });

  return NextResponse.json(response);
}
