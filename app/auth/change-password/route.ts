import { getSupabaseServerClient } from '@components/authUtils.server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const formData = await request.formData();

  const response = await supabase.rpc('change_user_password', {
    current_password: String(formData.get('current_password')),
    new_password: String(formData.get('new_password'))
  } as any);

  return NextResponse.json(response);
}
