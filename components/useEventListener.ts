import { useEffect } from 'react';

// The useEventListener() hook provides an easy abstraction for binding and
// unbinding a single event to any type of DOM element
function useEventListener(element: HTMLElement, eventType: string, eventCallback: (event: Event) => void, dependencies: any[] = []): void {

  useEffect(() => {
    element.addEventListener(eventType, eventCallback);
    return () => {
      element.removeEventListener(eventType, eventCallback);
    };

  // In the same way that useEffect doesn't need to pass the arrow function
  // callback it receives to the dependency array, neither do we need to pass
  // eventCallback to the dependency array below because we are already
  // spreading in the real dependecies provided by the caller
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [element, eventType, ...dependencies]);

}

export default useEventListener;
