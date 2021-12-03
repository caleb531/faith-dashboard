import { JSONSerializable } from '../types.d';

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
