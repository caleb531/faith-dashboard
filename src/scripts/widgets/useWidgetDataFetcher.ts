import React, { useContext, useRef, useEffect } from 'react';
import { WidgetState } from '../types';

// The useWidgetDataFetcher() hook is a powerful hook that allows you to fetch
// arbitrary data from an API endpoint given some user-supplied request query
// that's part of your widget; see the built-in widgets like BibleVerse or
// Podcast for examples on how this hook is used
export default function useWidgetDataFetcher({ widget, dispatch, shouldFetch, requestData, setRequestData, getApiUrl, parseResponse, hasResults, onSuccess, getNoResultsMessage, getErrorMessage }: {
  // The current state of the widget from the useWidgetShell() call
  widget: WidgetState,
  // The dispatch function from the useWidgetShell() call
  dispatch: Function,
  // A boolean function that should return true if the widget should fetch on
  // this render, and false otherwise; normally, this condition should be if
  // the request data is populated, and if there is no cached content
  shouldFetch: Function,
  // The request data to be used in building the API request; this will
  // probably be a user-entered query string of some sort
  requestData: string | object,
  // Receives the user-entered query as its only argument, and
  // should set query on the widget state (e.g. call the dispatch() function
  // returned by useWidgetShell(), or even a setter function from useState(),
  // and provide the user-entered query string as the payload); this callback
  // receives the user-entered query as its only argument
  setRequestData: Function,
  // Receives the request data as input, and returns a string representing the
  // full URL of the API endpoint to call; this
  getApiUrl: Function,
  // Parses the response from the designated API (which is assumed to be a JSON
  // response) by performing any property access to get at the objects or data
  // you actually want to store (or to simplify the object structure for later
  // use)
  parseResponse: Function,
  // A boolean function that should return true if the result of
  // parseResponse() has content to display, or false if (in which case the No
  // Results message is triggered)
  hasResults: Function,
  // If hasResults() returns true, this callback runs with the return value of
  // parseResponse() as its only argument; you will probably want to call a
  // dispatch() function or useState() setter within this callback to persist
  // the response data to the widget state
  onSuccess: Function,
  // Accepts the return value of parseResponse() as its only argument, and
  // should return a string representing the message to show if hasResults()
  // returns false
  getNoResultsMessage: Function,
  // Accepts an Error object as its only argument, and should return a string
  // representing the message to show if the API returned an error response, or
  // if some other runtime error occurred during the fetch
  getErrorMessage: Function,
}, dependencies: any[]): {
  // Either the return value of getNoResultsMessage(), the return value of
  // getErrorMessage(), or null, depending on the outcome of the fetch
  fetchError: string,
  // A reference to an HTML <input> element to which the request query should
  // be bound; this ref should be attached to whatever <input> you are
  // rendering into your widget's settings UI that represents the request query
  requestDataInputRef: { current: HTMLInputElement },
  // The submit handler; you should attach this to the <form> element in your
  // widget settings so that the request query can be set on the widget state
  // when the form is submitted
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
