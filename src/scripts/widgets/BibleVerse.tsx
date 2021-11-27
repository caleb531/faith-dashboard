import 'regenerator-runtime/runtime';
import React, { useReducer, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { WidgetDataState, StateAction, WidgetContentsParameters } from '../types.d';
import { useWidgetUpdater } from '../hooks';
import LoadingIndicator from '../LoadingIndicator';

export function reducer(state: WidgetDataState, action: StateAction): WidgetDataState {
  switch (action.type) {
    case 'setVerseContent':
      return {
        ...state,
        isFetchingVerse: false,
        verseContent: action.payload
      };
    case 'setVerseQuery':
      return { ...state, verseQuery: action.payload, verseContent: null };
    case 'showLoading':
      return { ...state, isFetchingVerse: true };
    default:
      return state;
  }
}

function BibleVerse({ widget, widgetData, dispatchWidget }: WidgetContentsParameters) {

  // If the user refreshes the page while a verse is loading, it will still be
  // persisted to localStorage by the time we load the page again, so we must
  // reset the flag to prevent the widget from loading infinitely
  const [state, dispatch] = useReducer(reducer, { widgetData, isFetchingVerse: false });
  const { verseQuery, verseContent, isFetchingVerse } = state as {
    verseQuery: string,
    verseContent: string,
    isFetchingVerse: boolean
  };

  const searchInputRef: {current: HTMLInputElement} = useRef(null);

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  async function fetchVerseContent(query: string): Promise<Array<string>> {
    dispatchWidget({ type: 'closeSettings' });
    dispatch({ type: 'showLoading' });
    const verseResponse = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
    const verseData = await verseResponse.json();
    if (verseData.passages) {
      // The passages array is non-empty when the API found at least one result,
      // and empty when there are no results
      dispatch({ type: 'setVerseContent', payload: verseData.passages.join('') });
    } else {
      // If the API responds with an error, no passages array is returned
      dispatch({ type: 'setVerseContent', payload: null });
    }
    return verseData;
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
    if (verseQuery && !verseContent && verseContent !== '' && !isFetchingVerse) {
      fetchVerseContent(verseQuery);
    }
  }, [verseQuery, verseContent, isFetchingVerse]);

  return (
    <section className="bible-verse">
      {(widget.isSettingsOpen || !verseQuery || !verseContent) && !isFetchingVerse ? (
        <>
          <h2 className="bible-verse-heading">Bible Verse</h2>
          <form
            className="bible-verse-picker"
            onSubmit={(event) => submitVerseSearch((event))}>
            <input
              type="text"
              className="bible-verse-picker-search"
              name="search"
              defaultValue={verseQuery}
              placeholder="e.g. gen1.1, psa.23.1-5"
              required
              ref={searchInputRef} />
            <button className="bible-verse-picker-submit">Submit</button>
            {verseQuery && verseContent === '' ? (
              <p className="bible-verse-no-results">No Results Found</p>
            ) : null}
          </form>
        </>
      ) : verseQuery && isFetchingVerse ? (
        <LoadingIndicator />
      ) : verseQuery && verseContent && verseContent.length ? (
        <div className="bible-verse-content">
          {HtmlReactParser(verseContent)}
        </div>
      ) : null}
    </section>
  );

}

export default BibleVerse;
