import 'regenerator-runtime/runtime';
import React, { useContext, useReducer, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { WidgetState, WidgetDataState } from '../Widget.d';
import { useWidgetUpdater } from '../hooks';

function BibleVerse({ widget, widgetData, dispatchWidget }: { widget: WidgetState, widgetData: WidgetDataState, dispatchWidget: Function }) {

  function reducer(state, action): WidgetDataState {
    switch (action.type) {
      case 'setVerseContent':
        return {
          ...state,
          isFetchingVerse: false,
          verseContent: action.payload
        };
      case 'setVerseQuery':
        return {...state, verseQuery: action.payload};
      case 'showLoading':
        return {...state, isFetchingVerse: true};
      default:
        return state;
    }
  }

  // Strip out transient data from state of widget data restored from local
  function resetState(state) {
    return {...state, verseContent: null, isFetchingVerse: false};
  }

  const [state, dispatch] = useReducer(reducer, resetState(widgetData));
  const { verseQuery, verseContent, isFetchingVerse } = state;

  const searchInputRef: {current: HTMLInputElement} = useRef(null);

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  async function fetchVerseContent(query) {
    if (!query) {
      return;
    }
    dispatchWidget({type: 'closeSettings'});
    dispatch({type: 'showLoading'});
    const verseResponse = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
    const verseData = await verseResponse.json();
    if (verseData.passages) {
      dispatch({type: 'setVerseContent', payload: verseData.passages});
    } else {
      dispatch({type: 'setVerseContent', payload: null});
    }
  }

  function submitVerseSearch(event) {
    event.preventDefault();
    const input = searchInputRef.current;
    if (input) {
      dispatch({type: 'setVerseQuery', payload: input.value});
      fetchVerseContent(input.value);
    }
  }

  // Save updates to widget as changes are made
  useWidgetUpdater(widget, state);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
  // Fetch verse content on initial render
    if (!verseContent) {
      fetchVerseContent(verseQuery);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <section className="bible-verse">
      {(widget.isSettingsOpen || !verseQuery || (verseContent && verseContent.length === 0)) && !isFetchingVerse ? (
        <>
          <h3 className="bible-verse-heading">Bible Verse</h3>
          <form
            className="bible-verse-picker"
            onSubmit={(event) => submitVerseSearch((event))}>
            <input
              type="text"
              className="bible-verse-picker-search"
              name="search"
              defaultValue={verseQuery}
              ref={searchInputRef} />
            <button className="bible-verse-picker-submit">Submit</button>
            {verseQuery && !(verseContent && verseContent.length) ? (
              <p className="bible-verse-no-results">No Results Found</p>
            ) : null}
          </form>
        </>
      ) : verseQuery && isFetchingVerse ? (
        <div className="widget-loading">Loading...</div>
      ) : verseQuery && verseContent && verseContent.length ? (
        <div className="bible-verse-content">
          {HtmlReactParser(verseContent.join(''))}
        </div>
      ) : null}
    </section>
  );

}

export default BibleVerse;
