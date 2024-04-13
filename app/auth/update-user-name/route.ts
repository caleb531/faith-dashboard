import { getSupabaseServerClient } from '@components/authUtils.server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const formData = await request.formData();

  const response = await supabase.auth.updateUser({
    data: {
      first_name: String(formData.get('first_name')),
      last_name: String(formData.get('last_name'))
    }
  });

  return NextResponse.json(response);
}
