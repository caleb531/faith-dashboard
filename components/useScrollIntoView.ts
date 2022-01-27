import { RefObject, useEffect } from 'react';

// The useScrollintoView() hook will scroll an element (specified by the given
// ref) into view when the given condition is true; if the condition is not
// true, nothing happens
function useScrollIntoView({ shouldScrollIntoView, ref }: { shouldScrollIntoView: boolean, ref: RefObject<HTMLElement>}) {

  useEffect(() => {
    if (shouldScrollIntoView) {
      ref.current.scrollIntoView({
        // Animate the scrolling
        behavior: 'smooth',
        // Try to center the viewport around the element
        block: 'center'
      });
    }
  }, [shouldScrollIntoView, ref]);

}

export default useScrollIntoView;
