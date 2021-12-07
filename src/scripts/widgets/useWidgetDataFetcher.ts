import React, { Dispatch, useContext, useRef, useEffect } from 'react';
import { WidgetState, StateAction } from '../types';
import { JSONSerializable } from '../types.d';

// The useWidgetDataFetcher() hook is a powerful hook that allows you to fetch
// arbitrary data from an API endpoint given some user-supplied request query
// that's part of your widget; see the built-in widgets like BibleVerse or
// Podcast for examples on how this hook is used
export default function useWidgetDataFetcher({ widget, dispatch, shouldFetchInitially, requestQuery, setRequestQuery, getApiUrl, parseResponse, hasResults, onSuccess, getNoResultsMessage, getErrorMessage }: {
  // The current state of the widget from the useWidgetShell() call
  widget: WidgetState,
  // The dispatch function from the useWidgetShell() call
  dispatch: Dispatch<StateAction>,
  // A boolean function that should return true if the widget should fetch on
  // the initial render, and false otherwise; normally, this condition should
  // evaluate if the request data is populated, and if there is no cached
  // content
  shouldFetchInitially: () => any,
  // The user-entered query string to be used in building the API request
  requestQuery: string,
  // Receives the user-entered query as its only argument, and
  // should set query on the widget state (e.g. call the dispatch() function
  // returned by useWidgetShell(), or even a setter function from useState(),
  // and provide the user-entered query string as the payload); this callback
  // receives the user-entered query as its only argument
  setRequestQuery: (requestQuery: string) => void,
  // Receives the request data as input, and returns a string representing the
  // full URL of the API endpoint to call; this
  getApiUrl: (requestQuery: string) => string,
  // Parses the response from the designated API (which is assumed to be a JSON
  // response) by performing any property access to get at the objects or data
  // you actually want to store (or to simplify the object structure for later
  // use)
  parseResponse: (data: JSONSerializable) => JSONSerializable,
  // A boolean function that should return true if the result of
  // parseResponse() has content to display, or false if (in which case the No
  // Results message is triggered)
  hasResults: (data: JSONSerializable) => any,
  // If hasResults() returns true, this callback runs with the return value of
  // parseResponse() as its only argument; you will probably want to call a
  // dispatch() function or useState() setter within this callback to persist
  // the response data to the widget state
  onSuccess: (data: JSONSerializable) => void,
  // Accepts the return value of parseResponse() as its only argument, and
  // should return a string representing the message to show if hasResults()
  // returns false
  getNoResultsMessage: (data: JSONSerializable) => string,
  // Accepts an Error object as its only argument, and should return a string
  // representing the message to show if the API returned an error response, or
  // if some other runtime error occurred during the fetch
  getErrorMessage: (error: Error) => string,
}): {
  // Either the return value of getNoResultsMessage(), the return value of
  // getErrorMessage(), or null, depending on the outcome of the fetch
  fetchError: string,
  // A reference to an HTML <input> element to which the request query should
  // be bound; this ref should be attached to whatever <input> you are
  // rendering into your widget's settings UI that represents the request query
  requestQueryInputRef: { current: HTMLInputElement },
  // The submit handler; you should attach this to the <form> element in your
  // widget settings so that the request query can be set on the widget state
  // when the form is submitted
  submitRequestQuery: Function,
  // This hook will also expose the low-level fetchWidgetData() function,
  // allowing you to fetch widget data manually (perhaps based on some action
  // other than the user submitting a form, therefore making
  // submitRequestQuery() a non-ideal solution)
  fetchWidgetData: Function
} {

  const isLoading = false;
  const { fetchError } = widget;

  function fetchWidgetData(newRequestQuery: string): Promise<void> {
    dispatch({ type: 'showLoading' });
    return fetch(getApiUrl(newRequestQuery))
      .then((rawResponse) => rawResponse.json())
      .then((response) => parseResponse(response))
      .then((data) => {
        if (hasResults(data)) {
          onSuccess(data);
          dispatch({ type: 'showContent' });
        } else {
          dispatch({ type: 'setFetchError', payload: getNoResultsMessage(data) });
        }
      })
      .catch((error) => {
        console.log('error', error);
        dispatch({ type: 'setFetchError', payload: getErrorMessage(error) });
      });
  }

  // Store a ref to the input element to which the request data will be bound
  const requestQueryInputRef: {current: HTMLInputElement} = useRef(null);

  // In order to avoid excessive renders, the <input> field for the user's
  // request data is uncontrolled, and instead, the user must explicitly submit
  // the form in order for the verse query to be set on the state
  function submitRequestQuery(event: React.FormEvent): void {
    event.preventDefault();
    const input = requestQueryInputRef.current;
    if (input) {
      setRequestQuery(input.value);
      fetchWidgetData(input.value);
    }
  }

  // Fetch the widget data when the widget initially loads (presuming the
  // widget data is not already cached according to the logic dictated by
  // shouldFetchInitially())
  useEffect(() => {
    // There are cases where even though this effect should only run when the
    // page initially loads, an unmount/re-mount of the component can also
    // trigger this effect to run, and if there was a fetch error, cause an
    // infinite loop; to fix this, we stop fetching if the previous fetch
    // resulted in an error
    if (shouldFetchInitially() && !isLoading && !fetchError) {
      fetchWidgetData(requestQuery);
    }
    // The React Docs suggest using an empty array when we only want a hook to
    // run exactly one time, which is the case here because we only want to
    // fetch data when the widget is initially loaded; any subsequent fetches
    // should require the user to submit the Settings form; previous attempts
    // to synchronize this effect with state changes have resulted in infinite
    // loops, and have made the code more fragile/tricky; for more information,
    // see:
    // <https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects>
  }, []);

  return {
    fetchError,
    submitRequestQuery,
    fetchWidgetData,
    requestQueryInputRef
  };

}
