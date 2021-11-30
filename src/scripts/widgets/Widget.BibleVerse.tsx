import React, { useReducer, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { WidgetDataState, StateAction, WidgetContentsParameters } from '../types';
import { BibleVerseData } from './Widget.BibleVerse.d';
import { useWidgetUpdater } from '../hooks';
import LoadingIndicator from '../generic/LoadingIndicator';

export function reducer(state: WidgetDataState, action: StateAction): WidgetDataState {
  switch (action.type) {
    case 'setVerseContent':
      return {
        ...state,
        isFetchingVerse: false,
        verseContent: action.payload,
        fetchError: null
      };
    case 'setVerseQuery':
      return {
        ...state,
        verseQuery: action.payload,
        verseContent: null,
        fetchError: null
      };
    case 'showLoading':
      return { ...state, isFetchingVerse: true, fetchError: null };
    case 'setFetchError':
      return { ...state, fetchError: action.payload, isFetchingVerse: false };
    default:
      return state;
  }
}

function BibleVerse({ widget, widgetData, dispatchWidget }: WidgetContentsParameters) {

  // If the user refreshes the page while a verse is loading, it will still be
  // persisted to localStorage by the time we load the page again, so we must
  // reset the flag to prevent the widget from loading infinitely
  const [state, dispatch] = useReducer(reducer, { ...widgetData, isFetchingVerse: false });
  const { verseQuery, verseContent, isFetchingVerse, fetchError } = state as {
    verseQuery: string,
    verseContent: string,
    isFetchingVerse: boolean,
    fetchError: string
  };

  const searchInputRef: {current: HTMLInputElement} = useRef(null);

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  async function fetchVerseContent(query: string): Promise<object> {
    dispatchWidget({ type: 'closeSettings' });
    dispatch({ type: 'showLoading' });
    try {
      const verseResponse = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
      const verseData = await verseResponse.json() as BibleVerseData;
      if (verseData.passages && verseData.passages.length) {
        // The passages array is non-empty when the API found at least one
        // result, and empty when there are no results
        dispatch({
          type: 'setVerseContent',
          payload: verseData.passages.join('')
        });
      } else {
        // If the API responds with no results, no passages array is returned
        dispatch({ type: 'setFetchError', payload: 'No Results Found' });
      }
      return verseData;
    } catch (error) {
      dispatch({ type: 'setFetchError', payload: 'Error Fetching Verse' });
      return null;
    }
  }

  // In order to avoid excessive renders, the <input> for the user's verse
  // query is uncontrolled, and instead, the user must explicitly submit the
  // form in order for the verse query to be set on the state
  function submitVerseSearch(event: React.FormEvent): void {
    event.preventDefault();
    const input = searchInputRef.current;
    if (input) {
      dispatch({ type: 'setVerseQuery', payload: input.value });
    }
  }

  // Save updates to widget as changes are made
  useWidgetUpdater(widget, state);

  useEffect(() => {
    // Fetch under the following conditions:
    // 1. The verse query must be set
    // 2. There is no cached verse content to pull from
    // 3. Any previous fetch did not turn up empty
    // 4. No verse content is currently being fetched
    // 5. No errors occurred when last fetching
    if (verseQuery && !verseContent && !isFetchingVerse && !fetchError) {
      fetchVerseContent(verseQuery);
    }
  }, [verseQuery, verseContent, isFetchingVerse, fetchError]);

  return (
    <section className="bible-verse">
      {(widget.isSettingsOpen || !verseQuery || !verseContent || fetchError) && !isFetchingVerse ? (
        <form
          className="bible-verse-settings"
          onSubmit={(event) => submitVerseSearch((event))}>
          <h2 className="bible-verse-heading">Bible Verse</h2>
          <input
            type="text"
            className="bible-verse-search"
            name="search"
            defaultValue={verseQuery}
            placeholder="e.g. gen1.1, psa.23.1-5"
            required
            ref={searchInputRef} />
          <button className="bible-verse-search-submit">Submit</button>
          {fetchError ? (
            <p className="bible-verse-error">{fetchError}</p>
          ) : null}
        </form>
      ) : verseQuery && isFetchingVerse ? (
        <LoadingIndicator />
      ) : verseQuery && verseContent ? (
        <div className="bible-verse-content">
          {HtmlReactParser(verseContent)}
        </div>
      ) : null}
    </section>
  );

}

export default BibleVerse;
