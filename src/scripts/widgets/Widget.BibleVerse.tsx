import React, { useReducer, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { StateAction, WidgetState, WidgetContentsParameters } from '../types.d';
import { BibleVerseData, BibleVerseWidgetState } from './Widget.BibleVerse.d';
import WidgetShell from './WidgetShell';
import useWidgetShell from './useWidgetShell';
import useWidgetDataFetcher from './useWidgetDataFetcher';

export function reducer(state: BibleVerseWidgetState, action: StateAction): BibleVerseWidgetState {
  switch (action.type) {
    case 'setVerseContent':
      const verseContent = action.payload as string;
      return { ...state, verseContent };
    case 'setVerseQuery':
      const verseQuery = action.payload as string;
      return { ...state, verseQuery, verseContent: null };
    default:
      throw new ReferenceError(`action ${action.type} does not exist on reducer`);
  }
}

function BibleVerseWidget({ widget, provided }: WidgetContentsParameters) {

  // If the user refreshes the page while a verse is loading, it will still be
  // persisted to localStorage by the time we load the page again, so we must
  // reset the flag to prevent the widget from loading infinitely
  const [state, dispatch] = useWidgetShell(reducer, widget);
  const { verseQuery, verseContent } = state as BibleVerseWidgetState;

  const { fetchError, submitRequestData, requestDataInputRef } = useWidgetDataFetcher({
    widget: state,
    dispatch,
    shouldFetch: () => verseQuery && !verseContent,
    requestData: verseQuery,
    setRequestData: (newQuery: typeof verseQuery) => {
      return dispatch({ type: 'setVerseQuery', payload: newQuery });
    },
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
    <WidgetShell widget={state} dispatch={dispatch} provided={provided}>
      <section className="bible-verse">
        {widget.isSettingsOpen || !verseQuery || !verseContent || fetchError ? (
          <form
            className="bible-verse-settings"
            onSubmit={(event) => submitRequestData((event))}>
            <h2 className="bible-verse-heading">Bible Verse</h2>
            <input
              type="text"
              className="bible-verse-search"
              name="search"
              defaultValue={verseQuery}
              placeholder="e.g. gen1.1, psa.23.1-5"
              required
              ref={requestDataInputRef} />
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
    </WidgetShell>
  );

}

export default BibleVerseWidget;
