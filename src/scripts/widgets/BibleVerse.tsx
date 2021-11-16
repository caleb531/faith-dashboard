import React, { useContext, useReducer, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { WidgetState, WidgetDataState, WidgetContentsParameters } from '../Widget.d';

function BibleVerse({ widget, widgetData, dispatchWidget, dispatchApp }: WidgetContentsParameters) {

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

  const [state, dispatch] = useReducer(reducer, widgetData);

  const searchInputRef: {current: HTMLInputElement} = useRef(null);

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  function fetchVerseContent(query) {
    if (!query) {
      return;
    }
    dispatchWidget({type: 'closeSettings'});
    dispatch({type: 'showLoading'});
    fetch(`${API_URL}?q=${encodeURIComponent(query)}`)
      .then((verseResponse) => verseResponse.json())
      .then((verseData) => {
        console.log('verseData', verseData);
        if (verseData.passages) {
          dispatch({type: 'setVerseContent', payload: verseData.passages});
        } else {
          dispatch({type: 'setVerseContent', payload: null});
        }
      });
  }

  function submitVerseSearch(event) {
    event.preventDefault();
    const input = searchInputRef.current;
    if (input) {
      dispatch({type: 'setVerseQuery', payload: input.value});
      fetchVerseContent(input.value);
    }
  }

  // Update widget list when changes are made
  useEffect(() => {
    dispatchApp({type: 'updateWidget', payload: { ...widget, data: state }});
  }, [widget, state, dispatchApp]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
  // Fetch verse content on initial render
    fetchVerseContent(state.verseQuery);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <section className="bible-verse">
      {widget.isSettingsOpen || !state.verseQuery ? (
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
      ) : state.verseQuery && state.isFetchingVerse ? (
        <div className="widget-loading">Loading...</div>
      ) : state.verseQuery && state.verseContent && state.verseContent.length ? (
        <div className="bible-verse-content">
          {HtmlReactParser(state.verseContent.join(''))}
        </div>
      ) : null}
    </section>
  );

}

export default BibleVerse;
