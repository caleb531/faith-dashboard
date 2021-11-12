import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { WidgetState } from '../Widget.d';

function BibleVerse({ widget }: { widget: WidgetState }) {

  const { app, dispatchApp } = useContext(AppContext);

  const ESV_API_BASE_URL = './widgets/BibleVerse/api.php';

  function submitVerseSearch(event) {
    event.preventDefault();
    const input = event.target.elements.search;
    fetch(ESV_API_BASE_URL).then((verseResponse) => {
      const verseData = verseResponse.json();
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
