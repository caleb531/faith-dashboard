import { useMemo } from 'react';

// The useMemoizedContextValue() hook is a simple wrapper around useMemo() to
// allow for passing an object of properties to a context provider without
// causing the reference to change on every render
function useMemoizedContextValue<T extends object>(contextValue: T): T {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  return useMemo(() => contextValue, Object.values(contextValue));
}
export default useMemoizedContextValue;
