import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../pages/index';
import bibleVerseMultipleJson from './__json__/bibleVerseMultiple.json';
import bibleVerseNoResultsJson from './__json__/bibleVerseNoResults.json';
import bibleVerseRangeJson from './__json__/bibleVerseRange.json';
import bibleVerseSingleJson from './__json__/bibleVerseSingle.json';
import { getWidgetData, waitForWidget } from './__utils__/testUtils';

async function searchBibleVerses(verseQuery: string) {
  await waitForWidget({ type: 'BibleVerse', index: 0 });
  await userEvent.type(
    screen.getAllByRole('searchbox', { name: 'Bible Verse Search Query' })[0],
    verseQuery
  );
  await userEvent.click(screen.getAllByRole('button', { name: 'Search' })[0]);
}

describe('Bible Verse widget', () => {
  it('should search for verse', async () => {
    fetch.mockResponseOnce(JSON.stringify(bibleVerseSingleJson));
    render(<Home />);

    await searchBibleVerses('rom8.28');
    expect(screen.getByText(/And we know/)).toHaveTextContent(
      'And we know that for those who love God all things work together for good, for those who are called according to his purpose.'
    );
    expect(getWidgetData({ type: 'BibleVerse', index: 0 })).toHaveProperty(
      'verseQuery',
      'rom8.28'
    );
  });

  it('should search for verse range', async () => {
    fetch.mockResponseOnce(JSON.stringify(bibleVerseRangeJson));
    render(<Home />);

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
    render(<Home />);

    await searchBibleVerses('hos6.6, mat9.13');
    expect(screen.getByText(/For I desire steadfast/)).toHaveTextContent(
      'For I desire steadfast love and not sacrifice,'
    );
    expect(screen.getByText(/the knowledge of/)).toHaveTextContent(
      'the knowledge of God rather than burnt offerings.'
    );
  });

  it('should handle no results', async () => {
    fetch.mockResponseOnce(JSON.stringify(bibleVerseNoResultsJson));
    render(<Home />);

    await searchBibleVerses('abc123');
    expect(screen.getByText('No Verses Found')).toBeInTheDocument();
  });

  it('should handle bad data from server', async () => {
    fetch.mockResponseOnce('notjson');
    render(<Home />);

    const log = jest.spyOn(console, 'log').mockImplementation(() => {
      /* noop */
    });
    await searchBibleVerses('john3.16');
    log.mockReset();
    expect(screen.getByText('Error Fetching Verse')).toBeInTheDocument();
  });
});
