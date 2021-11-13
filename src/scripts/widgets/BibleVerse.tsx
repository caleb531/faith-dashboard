/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import HtmlReactParser from 'html-react-parser';
import { AppContext } from '../AppContext';
import { WidgetState } from '../Widget.d';

function BibleVerse({ widget }: { widget: WidgetState }) {

  const { app, dispatchApp } = useContext(AppContext);
  const [ verseContent, setVerseContent ] = useState(null);
  const [ verseQuery, setVerseQuery ] = useState(widget.data.verseQuery);

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  function fetchVerseContent(query) {
    fetch(`${API_URL}?q=${encodeURIComponent(query)}`)
      .then((verseResponse) => verseResponse.json())
      .then((verseData) => {
        console.log('verseData', verseData);
        if (verseData.passages) {
          setVerseContent(verseData.passages.join(''));
        }
      });
  }

  function submitVerseSearch(event) {
    event.preventDefault();
    const input = event.target.elements.search;
    setVerseQuery(input.value);
    fetchVerseContent(input.value);
  }

  // Fetch verse content on first render
  useEffect(() => {
    fetchVerseContent(verseQuery);
  }, []);

  useEffect(() => {
    dispatchApp({type: 'save-app'});
  });

  return (
    <section className="bible-verse">
      {verseQuery && !verseContent ? (
        <div className="widget-loading">Loading...</div>
      ) : verseQuery && verseContent ? (
          <div className="bible-verse-content">
            {HtmlReactParser(verseContent)}
          </div>
        ) : (
            <>
              <h3 className="bible-verse-heading">Bible Verse</h3>
              <form className="bible-verse-picker" onSubmit={(event) => submitVerseSearch((event))}>
              <input type="text" className="bible-verse-picker-search" name="search" defaultValue={verseQuery} />
              <button className="bible-verse-picker-submit">Submit</button>
              </form>
            </>
          )
        }
    </section>
  );

}

export default BibleVerse;
