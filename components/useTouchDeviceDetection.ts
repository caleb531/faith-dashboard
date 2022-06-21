import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

// Return true if the user agent is a touch device; otherwise, return false
function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && window.ontouchstart !== undefined;
}

// The useTouchDeviceDetection() hook takes the given color theme and applies it
// to the <body> element of the page
export default function useTouchDeviceDetection() {
  useIsomorphicLayoutEffect(() => {
    if (isTouchDevice()) {
      document.body.classList.add('is-touch-device');
    } else {
      document.body.classList.add('is-not-touch-device');
    }
    return () => {
      document.body.classList.remove('is-touch-device');
      document.body.classList.remove('is-not-touch-device');
    };
  }, []);
}
