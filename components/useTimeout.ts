import { useCallback, useEffect, useRef } from 'react';

// The useTimeout() hook exposes a wrapper around setTimeout() which
// automatically cancels the timeout when the component unmounts, thus avoiding
// the "Can't perform a React state update on an unmounted component" warning;
// as a convenience, this hook can handle multiple calls to the setTimeout()
// wrapper, as
function useTimeout() {
  const timerListRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const setTimeoutWrapper = useCallback(
    (callback: () => void, timeout?: number) => {
      timerListRef.current.push(
        setTimeout(() => {
          callback();
        }, timeout)
      );
    },
    []
  );

  // Clear the timeout when the ThemeSwitcher component unmounts to prevent the
  // "unmounted component" error from React
  useEffect(() => {
    const timerList = timerListRef.current;
    return () => {
      timerList.forEach((timer) => {
        if (timer) {
          clearTimeout(timer);
        }
      });
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return setTimeoutWrapper;
}

export default useTimeout;
