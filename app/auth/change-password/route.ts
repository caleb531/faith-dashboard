import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();

  const response = await supabase.rpc('change_user_password', {
    current_password: String(formData.get('current_password')),
    new_password: String(formData.get('new_password'))
  });

  return NextResponse.json(response);
}
