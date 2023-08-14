import { getAllSearchParams } from '@app/api/utils';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const API_BASE_URL = 'https://itunes.apple.com/search';

export async function GET(request: Request) {
  const searchParams = getAllSearchParams(request);
  if (!searchParams.q) {
    return NextResponse.json(
      { error: 'Missing parameter: q' },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    term: String(searchParams.q),
    entity: 'podcast'
  });
  const response = await fetch(`${API_BASE_URL}?${params}`);
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
