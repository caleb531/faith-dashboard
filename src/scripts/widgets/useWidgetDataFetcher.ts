import React, { useContext, useRef, useEffect } from 'react';
import { WidgetState } from '../types';

export default function useWidgetDataFetcher({ widget, dispatch, shouldFetch, requestData, setRequestData, getApiUrl, parseResponse, hasResults, onSuccess, getNoResultsMessage, getErrorMessage }: {
  widget: WidgetState,
  dispatch: Function,
  shouldFetch: Function,
  requestData: any,
  setRequestData: Function,
  getApiUrl: Function,
  parseResponse: Function,
  hasResults: Function,
  onSuccess: Function,
  getNoResultsMessage: Function,
  getErrorMessage: Function,
}, dependencies: any[]): {
  fetchError: string,
  requestDataInputRef: { current: HTMLInputElement },
  submitRequestData: Function
} {

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

  // Store a ref to the input element to which the request data will be bound
  const requestDataInputRef: {current: HTMLInputElement} = useRef(null);

  // In order to avoid excessive renders, the <input> field for the user's
  // request data is uncontrolled, and instead, the user must explicitly submit
  // the form in order for the verse query to be set on the state
  function submitRequestData(event: React.FormEvent): void {
    event.preventDefault();
    const input = requestDataInputRef.current;
    if (input) {
      // Further down, we need to make the error message from the last fetch
      // part of the condition for fetching again (i.e. don't fetch again if an
      // error occurred), lest we trigger an infinite fetch loop; however, if
      // we are to do this, we must also blank out the fetch error whenever the
      // request data changes, otherwise you would be unable to submit a valid
      // query after an error was returned
      dispatch({ type: 'setFetchError', payload: null });
      setRequestData(input.value);
    }
  }

  // Fetch the widget data if everything is properly reset
  useEffect(() => {
    if (shouldFetch() && !isLoading && !fetchError) {
      fetchWidgetData();
    }
  }, [...dependencies, isLoading, fetchError]);

  return { fetchError, submitRequestData, requestDataInputRef };

}
