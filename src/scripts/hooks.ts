import { useContext, useState, useEffect } from 'react';
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

export function useWidgetDataFetcher({ shouldFetch, requestData, getApiUrl, closeSettings, parseResponse, hasResults, onSuccess, getNoResultsMessage, getErrorMessage }: {
  shouldFetch: Function,
  requestData: any,
  getApiUrl: Function,
  closeSettings: Function,
  parseResponse: Function,
  hasResults: Function,
  onSuccess: Function,
  getNoResultsMessage: Function,
  getErrorMessage: Function,
}, dependencies: any[]): { isFetching: boolean, fetchError: string } {

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  async function fetchWidgetData(): Promise<object> {
    setIsFetching(true);
    try {
      const verseResponse = await fetch(getApiUrl(requestData)) as { json: Function };
      const data = parseResponse(await verseResponse.json());
      if (hasResults(data)) {
        closeSettings();
        onSuccess(data);
        setIsFetching(false);
        setFetchError(null);
      } else {
        setIsFetching(false);
        setFetchError(getNoResultsMessage(data));
      }
      return data;
    } catch (error) {
      console.log('error', error);
      setIsFetching(false);
      setFetchError(getErrorMessage(error));
      return null;
    }
  }

  useEffect(() => {
    if (shouldFetch() && !isFetching && !fetchError) {
      fetchWidgetData();
    }
  }, [...dependencies, isFetching]);

  return { isFetching, fetchError };

}

export function useWidgetUpdater(widget: WidgetState, widgetData: WidgetDataState): void {

  const { dispatchToApp } = useContext(AppContext);

  // Update widget list when changes are made
  useEffect(() => {
    dispatchToApp({
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
