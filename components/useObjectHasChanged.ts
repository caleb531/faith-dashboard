import { diff } from 'deep-object-diff';
import { useRef } from 'react';

// The useObjectHasChanged() hook returns true if an object has changed
// compared to its previous state; otherwise, it returns false
function useObjectHasChanged<T extends object>(obj: T) {

  const currentObjRef = useRef(obj);
  currentObjRef.current = obj;
  const prevObjRef = useRef(obj);

  function getChanges(): Partial<T> | null {
    const changes = diff(currentObjRef.current, prevObjRef.current);
    if (Object.keys(changes).length > 0) {
      prevObjRef.current = currentObjRef.current;
      return changes;
    } else {
      return null;
    }
  }

  return [getChanges];

}

export default useObjectHasChanged;
