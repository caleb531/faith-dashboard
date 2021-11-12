import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { WidgetState } from '../Widget.d';
import esvApiData from './esv-api.json';

function BibleVerse({ widget }: { widget: WidgetState }) {

  const { app, dispatchApp } = useContext(AppContext);

  const ESV_API_BASE_URL = 'https://api.esv.org/v3/passage/html/?q=';

  function submitVerseSearch(event) {
    event.preventDefault();
    const input = event.target.elements.search;
    const apiPromise = fetch(ESV_API_BASE_URL, {
      mode: 'cors',
      headers: {
        'Authorization': `Token ${esvApiData.apiKey}`
      }
    });
    apiPromise.then((verseData) => {
      console.log('verseData', verseData);
    });
  }

  return (
    <section className="bible-verse">
        <h3 className="bible-verse-heading">Bible Verse</h3>
        <form className="bible-verse-picker" onSubmit={(event) => submitVerseSearch((event))}>
          <input type="text" className="bible-verse-picker-search" name="search" defaultValue="2 Cor 5.17" />
          <button className="bible-verse-picker-submit">Submit</button>
        </form>
    </section>
  );

}

export default BibleVerse;
