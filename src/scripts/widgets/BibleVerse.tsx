import React, { useContext, useState } from 'react';
import HtmlReactParser from 'html-react-parser';
import { AppContext } from '../AppContext';
import { WidgetState } from '../Widget.d';

function BibleVerse({ widget }: { widget: WidgetState }) {

  const { app, dispatchApp } = useContext(AppContext);
  const [ verseContent, setVerseContent ] = useState(null);
  const [ verseQuery, setVerseQuery ] = useState('2 Cor 5.17');

  // Call the ESV API through a proxy endpoint because the ESV API does not
  // support CORS
  const API_URL = './widgets/BibleVerse/api.php';

  function submitVerseSearch(event) {
    event.preventDefault();
    const input = event.target.elements.search;
    setVerseQuery(input.value);
    fetch(`${API_URL}?q=${encodeURIComponent(input.value)}`)
      .then((verseResponse) => verseResponse.json())
      .then((verseData) => {
        console.log('verseData', verseData);
        setVerseContent(verseData.passages.join(''));
      });
  }

  return (
    <section className="bible-verse">
        {verseContent ? (
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
