import HtmlReactParser from 'html-react-parser';
import React from 'react';
import useUniqueFieldId from '../../useUniqueFieldId';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import useWidgetShell from '../useWidgetShell';
import { WidgetParameters } from '../widget.d';
import WidgetShell from '../WidgetShell';
import { BibleVerseData, BibleVerseWidgetState } from './bibleVerse.d';
import reducer from './BibleVerseReducer';

const BibleVerseWidget = React.memo(function BibleVerseWidget({ widgetHead, provided }: WidgetParameters) {

  // If the user refreshes the page while a verse is loading, it will still be
  // persisted to localStorage by the time we load the page again, so we must
  // reset the flag to prevent the widget from loading infinitely
  const [state, dispatch] = useWidgetShell(reducer, widgetHead);
  const { verseQuery, verseContent } = state as BibleVerseWidgetState;

  const { fetchError, submitRequestQuery, requestQueryInputRef } = useWidgetDataFetcher({
    widget: state,
    dispatch,
    shouldFetchInitially: () => verseQuery && !verseContent,
    requestQuery: verseQuery,
    setRequestQuery: (newQuery: typeof verseQuery) => {
      return dispatch({ type: 'setVerseQuery', payload: newQuery });
    },
    getApiUrl: (query: typeof verseQuery) => {
      return `/api/widgets/bible-verse?q=${encodeURIComponent(query)}`;
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
  });

  const searchFieldId = useUniqueFieldId('bible-verse-search');

  return (
    <WidgetShell widget={state} dispatch={dispatch} provided={provided}>
      <section className="bible-verse">
        {state.isSettingsOpen || !verseQuery || !verseContent || fetchError ? (
          <form
            className="bible-verse-settings"
            onSubmit={(event) => submitRequestQuery((event))}>
            <h2 className="bible-verse-heading">Bible Verse</h2>
            <label htmlFor={searchFieldId} className="bible-verse-search accessibility-only">
              Search Query
            </label>
            <input
              type="search"
              id={searchFieldId}
              className="bible-verse-search"
              name="search"
              defaultValue={verseQuery}
              placeholder="e.g. gen1.1, psa.23.1-5"
              required
              ref={requestQueryInputRef} />
            <button type="submit" className="bible-verse-search-submit">Search</button>
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

});

export default BibleVerseWidget;