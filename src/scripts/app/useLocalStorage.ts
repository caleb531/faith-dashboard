import { JSONSerializable } from '../types.d';

// The useLocalStorage() hook is a simple wrapper around the localStorage API's
// getItem() and setItem() functions; it is especially handy because it handles
// all JSON serialization/deserialization on your behalf, so you can pass it an
// object initially, and expect to receive that object back from the setter
// function, without any need to call JSON.parse()
export default function useLocalStorage(key: string, defaultValue: JSONSerializable): [Function, Function] {

  function getLocalStorage(): JSONSerializable {
    const value = JSON.parse(localStorage.getItem(key));
    if (value) {
      return value;
    } else {
      return defaultValue;
    }
  }

  function setLocalStorage(myValue: JSONSerializable): void {
    localStorage.setItem(key, JSON.stringify(myValue));
  }

  return [getLocalStorage, setLocalStorage];

}
