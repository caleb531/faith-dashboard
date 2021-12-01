import { useContext, useEffect } from 'react';
import { AppContext } from './app/AppContext';
import { WidgetState, WidgetDataState } from './types.d';

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

export function useWidgetContentFetcher({ shouldFetch, requestData, getApiUrl, closeSettings, showLoading, parseResponse, hasResults, onSuccess, onNoResults, onError }: {
  shouldFetch: Function,
  requestData: any,
  getApiUrl: Function,
  closeSettings: Function,
  showLoading: Function,
  parseResponse: Function,
  hasResults: Function,
  onSuccess: Function,
  onNoResults: Function,
  onError: Function,
}, dependencies: any[]) {

  async function fetchWidgetData(): Promise<object> {
    closeSettings();
    showLoading();
    try {
      const verseResponse = await fetch(getApiUrl(requestData)) as { json: Function };
      const data = parseResponse(await verseResponse.json());
      if (hasResults(data)) {
        onSuccess(data);
      } else {
        onNoResults(data);
      }
      return data;
    } catch (error) {
      console.log('error', error);
      onError(error);
      return null;
    }
  }

  useEffect(() => {
    if (shouldFetch()) {
      fetchWidgetData();
    }
  }, dependencies);

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
        // Optionally strip out undesired values from the widget data before
        // the data is persisted
        data: widgetData
      }
    });
  }, [widget, widgetData]);

}
