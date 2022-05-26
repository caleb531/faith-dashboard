import { diff } from 'deep-object-diff';
import { useRef } from 'react';

// The useObjectHasChanged() hook returns true if the object has changed
// compared to its previous state; otherwise, it returns false
function useObjectHasChanged<T extends object>(obj: T) {

  const prevObjRef = useRef(obj);

  function hasChanged() {
    if (Object.keys(diff(obj, prevObjRef.current)).length > 0) {
      prevObjRef.current = obj;
      return true;
    } else {
      return false;
    }
  }

  return [hasChanged];

}

export default useObjectHasChanged;
