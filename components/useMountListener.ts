import { useEffect, useState } from 'react';

// A helper hook for browser-only components; it re-renders the component in
// which it is placed as soon as that component is mounted; this helps solve
// the 'Expected server HTML to contain a matching ...' errors, since mounting
// does not occur in NextJS's Server-Side Rendering (SSR) runtime
function useMountListener() {
  const [isMounted, setIsMounted] = useState(false);
  // Re-render component when view is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}
export default useMountListener;
