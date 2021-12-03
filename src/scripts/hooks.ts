import { useContext, useState, useEffect } from 'react';
import { AppContext } from './app/AppContext';
import { WidgetState } from './types.d';

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

export function useWidgetDataFetcher({ widget, dispatch, shouldFetch, requestData, getApiUrl, parseResponse, hasResults, onSuccess, getNoResultsMessage, getErrorMessage }: {
  widget: WidgetState,
  dispatch: Function,
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
    dispatch({ type: 'showLoading' });
    try {
      const verseResponse = await fetch(getApiUrl(requestData)) as { json: Function };
      const data = parseResponse(await verseResponse.json());
      if (hasResults(data)) {
        onSuccess(data);
        dispatch({ type: 'showContent' });
      } else {
        dispatch({ type: 'setFetchError', payload: getNoResultsMessage(data) });
      }
      return data;
    } catch (error) {
      console.log('error', error);
      dispatch({ type: 'setFetchError', payload: getErrorMessage(error) });
      return null;
    }
  }

  useEffect(() => {
    if (shouldFetch() && !isLoading && !fetchError) {
      fetchWidgetData();
    }
  }, [...dependencies, isLoading, fetchError]);

  return { fetchError };

}

export function useWidgetUpdater(widget: WidgetState): void {

  const { dispatchToApp } = useContext(AppContext);

  // Update widget list when changes are made
  useEffect(() => {
    dispatchToApp({
      type: 'updateWidget',
      payload: {
        ...widget,
        column: widget.column || 1
      }
    });
  }, [widget]);

}
