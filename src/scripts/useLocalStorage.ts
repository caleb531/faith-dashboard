import { useCallback } from 'react';

// The useLocalStorage() hook is a simple wrapper around the localStorage API's
// getItem() and setItem() functions; it is especially handy because it handles
// all JSON serialization/deserialization on your behalf, so you can pass it an
// object initially, and expect to receive that object back from the setter
// function, without any need to call JSON.parse()
export default function useLocalStorage<T>(key: string, defaultValue: T): [() => T, (newValue: T) => void] {

  // The getLocalStorage() function is guaranteed to be stable for the lifetime
  // of the component
  const getLocalStorage = useCallback(function getLocalStorage(): T {
    const value = JSON.parse(localStorage.getItem(key));
    if (value) {
      return value;
    } else {
      return defaultValue;
    }
  }, [key, defaultValue]);

  // The setLocalStorage() function is guaranteed to be stable for the lifetime
  // of the component
  const setLocalStorage = useCallback(function setLocalStorage(myValue: T): void {
    localStorage.setItem(key, JSON.stringify(myValue));
  }, [key]);

  return [getLocalStorage, setLocalStorage];

}
