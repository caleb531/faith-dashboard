import { useCallback } from 'react';

// The storage map for the cached state values
const stateCache: { [key: string]: any } = {};

// The useCachedState() hook caches a particular value across component
// mount/unmounts, using a unique key to identify the state along the way
function useCachedState<T>(
  cacheKey: string,
  init: () => T
): [T, (newState: T) => void, () => void] {
  function getState() {
    if (stateCache[cacheKey]) {
      return stateCache[cacheKey];
    } else {
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
