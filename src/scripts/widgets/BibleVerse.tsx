import React, { useContext, useReducer, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { AppContext } from '../AppContext';
import { WidgetState, WidgetDataState } from '../Widget.d';

function BibleVerse({ widgetData }: { widget: WidgetState, widgetData: WidgetDataState }) {

  const { app, dispatchApp } = useContext(AppContext);

  function reducer(state, action) {
    switch (action) {
      case 'setVerseContent':
        return {
          ...state,
            isFetchingVerse: action.payload && action.payload.length,
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

  const [ state, dispatch ] = useReducer(reducer, widgetData);

  const searchInputRef: {current: HTMLInputElement} = useRef(null);

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  function fetchVerseContent(query) {
    if (!query) {
      return;
    }
    dispatch({event: 'showLoading'});
    fetch(`${API_URL}?q=${encodeURIComponent(query)}`)
      .then((verseResponse) => verseResponse.json())
      .then((verseData) => {
        console.log('verseData', verseData);
        if (verseData.passages) {
          dispatch({action: 'setVerseContent', payload: verseData.passages});
        } else {
          dispatch({action: 'setVerseContent', payload: null});
        }
      });
  }

  function submitVerseSearch(event) {
    event.preventDefault();
    const input = searchInputRef.current;
    if (input) {
      dispatch({action: 'setVerseQuery', payload: input.value});
      fetchVerseContent(input.value);
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
  // Fetch verse content on initial render
    fetchVerseContent(state.verseQuery);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  console.log('render plzzz');

  return (
    <section className="bible-verse">
      {state.verseQuery && state.isFetchingVerse ? (
        <div className="widget-loading">Loading...</div>
      ) : state.verseQuery && state.verseContent && state.verseContent.length ? (
          <div className="bible-verse-content">
            {HtmlReactParser(state.verseContent.join(''))}
          </div>
        ) : (
            <>
              <h3 className="bible-verse-heading">Bible Verse</h3>
              <form
                className="bible-verse-picker"
                onSubmit={(event) => submitVerseSearch((event))}>
              <input
                type="text"
                className="bible-verse-picker-search"
                name="search"
                defaultValue={state.verseQuery}
                ref={searchInputRef} />
              <button className="bible-verse-picker-submit">Submit</button>
              {state.verseQuery && !(state.verseContent && state.verseContent.length) ? (
                <p className="bible-verse-no-results">No Results Found</p>
              ) : null}
              </form>
            </>
          )
        }
    </section>
  );

}

export default BibleVerse;
