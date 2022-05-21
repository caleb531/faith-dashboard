import { useEffect, useRef } from 'react';

// The useAutoFocus() hook is a workaround for the HTML autofocus/autoFocus
// attribute not always working in React
function useAutoFocus<T extends HTMLElement>() {

  const formFieldRef = useRef<T>(null);

  // Auto-focus the form field when the page component mounts (i.e. the
  // component in which the hook is called)
  useEffect(() => {
    if (formFieldRef.current) {
      formFieldRef.current.focus();
    }
  }, []);

  return {
    autoFocus: true,
    ref: formFieldRef
  };

}
export default useAutoFocus;
