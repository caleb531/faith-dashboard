import { diff } from 'deep-object-diff';
import { useRef } from 'react';

// The useObjectHasChanged() hook returns true if the object has changed
// compared to its previous state; otherwise, it returns false
function useObjectHasChanged<T extends object>(obj: T) {

  const prevObjRef = useRef(obj);

  function getChanges(): Partial<T> | null {
    const changes = diff(obj, prevObjRef.current);
    if (Object.keys(changes).length > 0) {
      prevObjRef.current = obj;
      return changes;
    } else {
      return null;
    }
  }

  return [getChanges];

}

export default useObjectHasChanged;
