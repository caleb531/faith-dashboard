import { useEffect } from 'react';

// The useElementEvents() hook provides an easy abstraction for binding and
// unbinding multiple events to an Audio element at once
function useElementEvents(element: HTMLElement, eventMap: { [key: string]: (event: Event) => void }): void {

  useEffect(() => {
    // Attach the given event callbacks to the designated element
    Object.keys(eventMap).forEach((eventType) => {
      element.addEventListener(eventType, eventMap[eventType]);
    });
    // On cleanup, unbind the same event listeners to the designated element
    return () => {
      Object.keys(eventMap).forEach((eventType) => {
        element.removeEventListener(eventType, eventMap[eventType]);
      });
    };
    // By using an empty dependencies array, we prevent listeners from being
    // repeatedly bound/unbound while the audio plays
  }, [element]);

}

export default useElementEvents;
