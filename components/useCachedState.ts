import { useCallback } from 'react';

// The storage map for the cached state values
const stateCache: Record<string, any> = {};

// The useCachedState() hook caches a particular value across component
// mount/unmounts, using a unique key to identify the state along the way
function useCachedState<T>(
  cacheKey: string,
  init: () => T
): [T, (newState: T) => void, () => void] {
  // Retrieve the cached value even when its value is falsy
  function getState() {
    if (Object.prototype.hasOwnProperty.call(stateCache, cacheKey)) {
      return stateCache[cacheKey];
    } else {
      // This module cache intentionally persists values across component unmounts
      // eslint-disable-next-line react-hooks/immutability -- cache initialization is the hook's documented purpose
      stateCache[cacheKey] = init();
      return stateCache[cacheKey];
    }
  }

  // The setState() function is guaranteed to be stable for the lifetime of the
  // component
  const setState = useCallback(
    (newState: T): void => {
      stateCache[cacheKey] = newState;
    },
    [cacheKey]
  );

  // The removeState() function is guaranteed to be stable for the lifetime of
  // the component
  const removeState = useCallback((): void => {
    delete stateCache[cacheKey];
  }, [cacheKey]);

  return [getState(), setState, removeState];
}

export default useCachedState;
