import { fromPairs } from 'lodash-es';

export function getAllSearchParams(request: Request) {
  const url = new URL(request.url);
  return fromPairs(Array.from(url.searchParams.entries()));
}
