import React, { useReducer, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { WidgetDataState, StateAction, WidgetContentsParameters } from '../types.d';
import { BibleVerseData } from './Widget.BibleVerse.d';
import { useWidgetDataFetcher, useWidgetUpdater } from '../hooks';

export function reducer(state: WidgetDataState, action: StateAction): WidgetDataState {
  switch (action.type) {
    case 'setVerseContent':
      return { ...state, verseContent: action.payload };
    case 'setVerseQuery':
      return { ...state, verseQuery: action.payload, verseContent: null };
    default:
      throw new ReferenceError(`action ${action.type} does not exist on reducer`);
  }
}

function BibleVerse({ widget, widgetData, dispatchToWidget }: WidgetContentsParameters) {

  // If the user refreshes the page while a verse is loading, it will still be
  // persisted to localStorage by the time we load the page again, so we must
  // reset the flag to prevent the widget from loading infinitely
  const [state, dispatch] = useReducer(reducer, widgetData);
  const { verseQuery, verseContent } = state as {
    verseQuery: string,
    verseContent: string
  };

  const searchInputRef: {current: HTMLInputElement} = useRef(null);

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

  const { fetchError } = useWidgetDataFetcher({
    widget,
    dispatchToWidget,
    shouldFetch: () => {
      return verseQuery && !verseContent;
    },
    requestData: verseQuery,
    getApiUrl: (query: typeof verseQuery) => {
      return `widgets/BibleVerse/api.php?q=${encodeURIComponent(query)}`;
    },
    parseResponse: (response: BibleVerseData) => response.passages.join(''),
    hasResults: (data: typeof verseContent) => (data !== ''),
    onSuccess: (data: typeof verseContent) => {
      dispatch({
        type: 'setVerseContent',
        payload: data
      });
    },
    getNoResultsMessage: (data: typeof verseContent) => 'No Verses Found',
    getErrorMessage: (error: Error) => 'Error Fetching Verse'
  }, [verseQuery, verseContent]);

  return (
    <section className="bible-verse">
      {widget.isSettingsOpen || !verseQuery || !verseContent || fetchError ? (
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
      ) : verseQuery && verseContent ? (
        <div className="bible-verse-content">
          {HtmlReactParser(verseContent)}
        </div>
      ) : null}
    </section>
  );

}

export default BibleVerse;
