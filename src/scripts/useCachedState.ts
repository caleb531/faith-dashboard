// The storage variable for the cached Audio element
const stateCache: { [key: string]: any } = {};

// The useCachedState() hook caches a particular value across component
// mount/unmounts, using a unique key to identify the state along the way
function useCachedState<T>(cacheKey: string, init: () => any): [
  T,
  (newState: T) => void
] {

  function getState() {
    if (stateCache[cacheKey]) {
      return stateCache[cacheKey];
    } else {
      stateCache[cacheKey] = init();
      return stateCache[cacheKey];
    }
  }

  function setState(newState: T): void {
    stateCache[cacheKey] = newState;
  }

  return [getState(), setState];

}

export default useCachedState;
