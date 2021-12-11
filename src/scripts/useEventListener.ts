import { useEffect } from 'react';

// The useEventListener() hook provides an easy abstraction for binding and
// unbinding a single event to any type of DOM element
function useEventListener(element: HTMLElement, eventType: string, eventCallback: (event: Event) => void): void {

  useEffect(() => {
    element.addEventListener(eventType, eventCallback);
    return () => {
      element.removeEventListener(eventType, eventCallback);
    };
  }, [element]);

}

export default useEventListener;
