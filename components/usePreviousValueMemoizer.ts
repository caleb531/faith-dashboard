import { MutableRefObject, useEffect, useRef } from 'react';

// The usePreviousValueMemoizer() hook returns the previous value of the
// supplied value, based on when the value passed to this hook changes; if there
// is no previous value (i.e. the value hasn't changed yet), then undefined is
// returned
function usePreviousValueMemoizer<TValue>(
  value: TValue
): [MutableRefObject<TValue | undefined>, MutableRefObject<TValue>] {
  const prevValueRef = useRef<TValue | undefined>();
  const currentValueRef = useRef<TValue>(value);

  // Watch for changes to the value and update the refs accordingly
  useEffect(() => {
    if (currentValueRef.current !== value) {
      prevValueRef.current = currentValueRef.current;
      currentValueRef.current = value;
    }
  }, [value]);

  return [prevValueRef, currentValueRef];
}
export default usePreviousValueMemoizer;
