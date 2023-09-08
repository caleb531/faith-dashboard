import { useCallback, useRef } from 'react';

// The useObjectKeyHasChanged() hook returns true if a particular property of an
// object has changed compared to its previous value; otherwise, it returns
// false
function useObjectKeyHasChanged<TObject extends Record<string, any>, TValue>(
  obj: TObject,
  key: string
) {
  // Keep a ref to the current value of the property, which will always be kept
  // up-to-date
  const currentObjRef = useRef<TValue>(obj[key]);
  currentObjRef.current = obj[key];
  // Keep a ref of the previous value of the property, which will only be
  // updated if the value has changed
  const prevObjRef = useRef<TValue>(obj[key]);

  // The getChange() function is guaranteed to be stable across renders
  const getChange = useCallback((): TValue | null => {
    if (currentObjRef.current !== prevObjRef.current) {
      const prevValue = prevObjRef.current;
      prevObjRef.current = currentObjRef.current;
      return prevValue;
    } else {
      return null;
    }
  }, []);

  return [getChange];
}

export default useObjectKeyHasChanged;
