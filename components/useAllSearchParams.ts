import { fromPairs } from 'lodash-es';

// The useAllSearchParams() hook retrieves an object of all search parameters
// for the current URL;
function useAllSearchParams() {
  const url = new URL(window.location.href);
  return fromPairs(Array.from(url.searchParams.entries()));
}
export default useAllSearchParams;
