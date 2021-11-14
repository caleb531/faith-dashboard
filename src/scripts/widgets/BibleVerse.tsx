import React, { useContext, useReducer, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { WidgetBoardContext } from '../WidgetBoardContext';
import { WidgetState } from '../Widget.d';

function BibleVerse({ widget }: { widget: WidgetState }) {

  const { dispatchWidgets } = useContext(WidgetBoardContext);

  function reducer(state, action): WidgetState {
    switch (action.type) {
      case 'setVerseContent':
        return {
          ...state,
          data: {
            ...state.data,
            isFetchingVerse: false,
            verseContent: action.payload
          }
        };
      case 'setVerseQuery':
        return {...state, data: {...state.data, verseQuery: action.payload}};
      case 'showLoading':
        return {...state, data: {...state.data, isFetchingVerse: true}};
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, widget);

  const searchInputRef: {current: HTMLInputElement} = useRef(null);

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  function fetchVerseContent(query) {
    if (!query) {
      return;
    }
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

  console.log('render bibleverse');

  // Update widget list when changes are made
  useEffect(() => {
    dispatchWidgets({type: 'updateWidget', payload: state });
  }, [state, dispatchWidgets]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
  // Fetch verse content on initial render
    fetchVerseContent(state.data.verseQuery);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <section className="bible-verse">
      {state.data.verseQuery && state.data.isFetchingVerse ? (
        <div className="widget-loading">Loading...</div>
      ) : state.data.verseQuery && state.data.verseContent && state.data.verseContent.length ? (
          <div className="bible-verse-content">
            {HtmlReactParser(state.data.verseContent.join(''))}
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
                defaultValue={state.data.verseQuery}
                ref={searchInputRef} />
              <button className="bible-verse-picker-submit">Submit</button>
              {state.data.verseQuery && !(state.data.verseContent && state.data.verseContent.length) ? (
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
