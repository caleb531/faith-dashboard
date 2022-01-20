import { useCallback } from 'react';

// Return true if the user agent supports localStorage; otherwise, return false
// (this protects us when running in the NextJS Server-Side Rendering (SSR)
// context);
function isLocalStorageSupported(): boolean {
  return typeof localStorage !== 'undefined';
}

// The useLocalStorage() hook is a simple wrapper around the localStorage API's
// getItem() and setItem() functions; it is especially handy because it handles
// all JSON serialization/deserialization on your behalf, so you can pass it an
// object initially, and expect to receive that object back from the setter
// function, without any need to call JSON.parse()
export default function useLocalStorage<T>(key: string, defaultValue: T): [
  () => T,
  (newValue: T) => void,
  () => void
] {

  // The getLocalStorage() function is guaranteed to be stable for the lifetime
  // of the component
  const getLocalStorage = useCallback((): T => {
    if (!isLocalStorageSupported()) {
      return defaultValue;
    }
    const value = JSON.parse(localStorage.getItem(key));
    if (value) {
      return value;
    } else {
      return defaultValue;
    }
  }, [key, defaultValue]);

  // The setLocalStorage() function is guaranteed to be stable for the lifetime
  // of the component
  const setLocalStorage = useCallback((myValue: T): void => {
    if (!isLocalStorageSupported()) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(myValue));
  }, [key]);

  const removeLocalStorage = useCallback((): void => {
    if (!isLocalStorageSupported()) {
      return;
    }
    localStorage.removeItem(key);
  }, [key]);

  return [getLocalStorage, setLocalStorage, removeLocalStorage];

}
