import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../../pages/index';
import bibleVerseMultipleJson from './__json__/bibleVerseMultiple.json';
import bibleVerseRangeJson from './__json__/bibleVerseRange.json';
import bibleVerseSingleJson from './__json__/bibleVerseSingle.json';
import { getWidgetData } from './__utils__/test-utils';

async function searchBibleVerses(verseQuery: string) {
  render(<Home />);
  await waitFor(async () => {
    expect(screen.getAllByRole('article')[0]).toHaveProperty(
      'dataset.widgetType',
      'BibleVerse'
    );
  });
  await userEvent.type(
    screen.getAllByRole('searchbox', { name: 'Bible Verse Search Query' })[0],
    verseQuery
  );
  await userEvent.click(screen.getAllByRole('button', { name: 'Search' })[0]);
}

describe('Bible Verse widget', () => {
  it('should search for verse', async () => {
    fetch.mockResponseOnce(JSON.stringify(bibleVerseSingleJson));

    await searchBibleVerses('rom8.28');
    expect(screen.getByText(/And we know/)).toHaveTextContent(
      'And we know that for those who love God all things work together for good, for those who are called according to his purpose.'
    );
    const widgetId = screen.getAllByRole('article')[0].dataset
      .widgetId as string;
    expect(getWidgetData('BibleVerse', widgetId)).toHaveProperty(
      'verseQuery',
      'rom8.28'
    );
  });

  it('should search for verse range', async () => {
    fetch.mockResponseOnce(JSON.stringify(bibleVerseRangeJson));

    await searchBibleVerses('mat11.28');
    expect(screen.getByText(/Come to me/)).toHaveTextContent(
      'Come to me, all who labor and are heavy laden, and I will give you rest.'
    );
    expect(screen.getByText(/Take my yoke/)).toHaveTextContent(
      'Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls.'
    );
    expect(screen.getByText(/For my yoke/)).toHaveTextContent(
      'For my yoke is easy, and my burden is light.'
    );
  });

  it('should search for multiple verses', async () => {
    fetch.mockResponseOnce(JSON.stringify(bibleVerseMultipleJson));

    await searchBibleVerses('hos6.6, mat9.13');
    expect(screen.getByText(/For I desire steadfast/)).toHaveTextContent(
      'For I desire steadfast love and not sacrifice,'
    );
    expect(screen.getByText(/the knowledge of/)).toHaveTextContent(
      'the knowledge of God rather than burnt offerings.'
    );
  });
});
