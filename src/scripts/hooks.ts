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

export function useWidgetDataFetcher({ widget, dispatchToWidget, shouldFetch, requestData, getApiUrl, parseResponse, hasResults, onSuccess, getNoResultsMessage, getErrorMessage }: {
  widget: WidgetState,
  dispatchToWidget: Function,
  shouldFetch: Function,
  requestData: any,
  getApiUrl: Function,
  parseResponse: Function,
  hasResults: Function,
  onSuccess: Function,
  getNoResultsMessage: Function,
  getErrorMessage: Function,
}, dependencies: any[]): { fetchError: string } {

  const { isLoading, fetchError } = widget;

  async function fetchWidgetData(): Promise<object> {
    dispatchToWidget({ type: 'showLoading' });
    try {
      const verseResponse = await fetch(getApiUrl(requestData)) as { json: Function };
      const data = parseResponse(await verseResponse.json());
      if (hasResults(data)) {
        onSuccess(data);
        dispatchToWidget({ type: 'showContent' });
      } else {
        dispatchToWidget({ type: 'setFetchError', payload: getNoResultsMessage(data) });
      }
      return data;
    } catch (error) {
      console.log('error', error);
      dispatchToWidget({ type: 'setFetchError', payload: getErrorMessage(error) });
      return null;
    }
  }

  useEffect(() => {
    if (shouldFetch() && !isLoading && !fetchError) {
      fetchWidgetData();
    }
  }, [...dependencies, isLoading]);

  return { fetchError };

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
