import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const response = await supabase.rpc('cancel_email_change');

  return NextResponse.json(response);
}
