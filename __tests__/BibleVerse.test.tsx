import Home from '@app/page';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import bibleVerseRangeJson from '@tests/__json__/bibleVerseRange.json';
import bibleVerseSingleJson from '@tests/__json__/bibleVerseSingle.json';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { getWidgetData, waitForWidget } from '@tests/__utils__/testUtils';
import fetch from 'jest-fetch-mock';

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
    await renderServerComponent(<Home />);

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
    await renderServerComponent(<Home />);

    await searchBibleVerses('mat11.28');
    expect(screen.getByText(/Come to me/)).toHaveTextContent(
      'Come to me, all who labor and are heavy laden, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls. For my yoke is easy, and my burden is light.”'
    );
  });

  it('should handle bad data from server', async () => {
    fetch.mockResponseOnce('notjson');
    await renderServerComponent(<Home />);

    const log = jest.spyOn(console, 'log').mockImplementation(() => {
      /* noop */
    });
    await searchBibleVerses('john3.16');
    log.mockReset();
    await waitFor(() => {
      expect(screen.getByText('Error Fetching Verse')).toBeInTheDocument();
    });
  });
});
