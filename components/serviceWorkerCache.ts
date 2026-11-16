// Keep credentials and personalized Next.js responses out of runtime caches
export function shouldBypassRuntimeCache({
  request,
  url
}: {
  request: Request;
  url: URL;
}): boolean {
  return (
    request.mode === 'navigate' ||
    request.headers.has('authorization') ||
    request.headers.get('rsc') === '1' ||
    url.searchParams.has('_rsc') ||
    /^\/(?:auth|api\/auth)(?:\/|$)/.test(url.pathname) ||
    url.pathname.startsWith('/_next/data/')
  );
}
