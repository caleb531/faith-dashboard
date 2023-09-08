import { diff } from 'deep-object-diff';
import { useCallback, useRef } from 'react';

// The useObjectHasChanged() hook returns true if an object has changed
// compared to its previous state; otherwise, it returns false
function useObjectHasChanged<TObject extends object>(obj: TObject) {
  // Keep a ref to the current state of the object, which will always be kept
  // up-to-date
  const currentObjRef = useRef(obj);
  currentObjRef.current = obj;
  // Keep a ref of the previous state of the object, which will only be updated
  // if the object state has changed (using deep comparison; see below)
  const prevObjRef = useRef(obj);

  // The getChanges() function is guaranteed to be stable across renders
  const getChanges = useCallback((): Partial<TObject> | null => {
    const changes = diff(currentObjRef.current, prevObjRef.current);
    if (Object.keys(changes).length > 0) {
      prevObjRef.current = currentObjRef.current;
      return changes;
    } else {
      return null;
    }
  }, []);

  return [getChanges];
}

export default useObjectHasChanged;
