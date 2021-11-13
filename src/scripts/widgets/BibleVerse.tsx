import React, { useContext, useState, useRef, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { AppContext } from '../AppContext';
import { WidgetState } from '../Widget.d';

function BibleVerse({ widget }: { widget: WidgetState }) {

  const { app, dispatchApp } = useContext(AppContext);
  const [ verseContent, setVerseContent ] = useState(null);
  const [ verseQuery, setVerseQuery ] = useState(widget.data.verseQuery);
  const [ isFetchingVerse, setIsFetchingVerse ] = useState(false);
  const searchInputRef: {current: HTMLInputElement} = useRef();

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  function fetchVerseContent(query) {
    if (!query) {
      return;
    }
    setIsFetchingVerse(true);
    fetch(`${API_URL}?q=${encodeURIComponent(query)}`)
      .then((verseResponse) => verseResponse.json())
      .then((verseData) => {
        console.log('verseData', verseData);
        setIsFetchingVerse(false);
        if (verseData.passages) {
          setVerseContent(verseData.passages);
        } else {
          setVerseContent(null);
        }
      });
  }

  function submitVerseSearch(event) {
    event.preventDefault();
    const input = searchInputRef.current;
    if (input) {
      setVerseQuery(input.value);
      fetchVerseContent(input.value);
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
  // Fetch verse content on initial render
    fetchVerseContent(verseQuery);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <section className="bible-verse">
      {verseQuery && isFetchingVerse ? (
        <div className="widget-loading">Loading...</div>
      ) : verseQuery && verseContent && verseContent.length ? (
          <div className="bible-verse-content">
            {HtmlReactParser(verseContent.join(''))}
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
                defaultValue={verseQuery}
                ref={searchInputRef} />
              <button className="bible-verse-picker-submit">Submit</button>
              {verseQuery && !(verseContent && verseContent.length) ? (
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
