import { useContext, useEffect } from 'react';
import { AppContext } from './AppContext';
import { WidgetState, WidgetDataState } from '../types/Widget.d';

type LocalStorageData = string | number | boolean | LocalStorageData[] | object;

export function useLocalStorage(key: string, defaultValue: LocalStorageData): [Function, Function] {

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

export function useWidgetUpdater(widget: WidgetState, widgetData: WidgetDataState): void {

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
