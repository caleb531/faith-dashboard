import { useCallback, useEffect, useRef } from 'react';

// The useTimeout() hook exposes a wrapper around setTimeout() which
// automatically cancels the timeout when the component unmounts, thus avoiding
// the "Can't perform a React state update on an unmounted component" warning;
// as such, this wrapper function can only be called once per component (since
// multiple calls would otherwise share the same timer)
function useTimeout() {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const setTimeoutWrapper = useCallback(
    (callback: () => void, timeout: number | undefined) => {
      timerRef.current = setTimeout(() => {
        callback();
      }, timeout);
    },
    []
  );

  // Clear the timeout when the ThemeSwitcher component unmounts to prevent the
  // "unmounted component" error from React
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return setTimeoutWrapper;
}

export default useTimeout;
