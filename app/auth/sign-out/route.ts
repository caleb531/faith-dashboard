import { getSupabaseServerClient } from '@components/authUtils.server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();

  const response = await supabase.auth.signOut();

  return NextResponse.json(response);
}
