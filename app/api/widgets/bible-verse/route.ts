import { NextResponse } from 'next/server';
import { fetchReferenceContent } from 'youversion-suggest';
import { getAllSearchParams } from '../../utils';

export async function GET(request: Request) {
  const searchParams = getAllSearchParams(request);
  if (!searchParams.q) {
    return NextResponse.json(
      { error: 'Missing parameter: q' },
      { status: 400 }
    );
  }
  try {
    const reference = await fetchReferenceContent(String(searchParams.q), {
      language: 'eng',
      fallbackVersion: 'esv'
    });

    return NextResponse.json(reference);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Error' },
      { status: 500 }
    );
  }
}
