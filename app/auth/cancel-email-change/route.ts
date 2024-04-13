import { getSupabaseServerClient } from '@components/authUtils.server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();

  const response = await supabase.rpc('cancel_email_change');

  return NextResponse.json(response);
}
