import { useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

export function useLocalStorage(key, defaultValue): [Function, Function] {

  type LocalStorageData = any;

  function getLocalStorage(): LocalStorageData {
    const value = JSON.parse(localStorage.getItem(key));
    if (value) {
      return value;
    } else {
      return defaultValue;
    }
  }

  function setLocalStorage(myValue: LocalStorageData): void {
    localStorage.setItem(key, JSON.stringify(myValue));
  }

  return [getLocalStorage, setLocalStorage];

}

export function useWidgetUpdater(widget, widgetData) {

  const { dispatchApp } = useContext(AppContext);

  // Update widget list when changes are made
  useEffect(() => {
    dispatchApp({
      type: 'updateWidget',
      payload: {
        ...widget,
        column: widget.column || 1,
        data: widgetData
      }
    });
  }, [widget, widgetData, dispatchApp]);

}
