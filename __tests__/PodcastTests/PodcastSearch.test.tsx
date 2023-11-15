import Home from '@app/page';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import podcastNoResultsJson from '@tests/__json__/podcastNoResults.json';
import podcastSearchJson from '@tests/__json__/podcastSearch.json';
import fetch from '@tests/__mocks__/fetchMock';
import { searchPodcasts } from '@tests/__utils__/podcastTestUtils';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';

async function seekAudio({ newCurrentTime }: { newCurrentTime: number }) {
  const audioProgressSlider = (await screen.findByRole('slider', {
    name: 'Audio Progress'
  })) as HTMLInputElement;
  expect(audioProgressSlider).toBeInTheDocument();

  fireEvent.mouseDown(audioProgressSlider);
  fireEvent.input(audioProgressSlider, {
    target: { value: String(newCurrentTime) }
  });
  fireEvent.change(audioProgressSlider, {
    target: { value: String(newCurrentTime) }
  });
  fireEvent.mouseUp(audioProgressSlider);
}

describe('Podcast widget', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle no results', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastNoResultsJson));
    await renderServerComponent(<Home />);

    await searchPodcasts('abc123xyz');
    expect(await screen.findByText('No Podcasts Found')).toBeInTheDocument();
  });

  it('should clear last search results after changing query', async () => {
    await renderServerComponent(<Home />);

    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    await searchPodcasts('sermon of the day');
    expect(await screen.findByText('26 podcasts')).toBeInTheDocument();

    fetch.mockResponseOnce(JSON.stringify(podcastNoResultsJson));
    await searchPodcasts('abc123xyz');
    expect(screen.queryByText('26 podcasts')).not.toBeInTheDocument();
  });

  it('should handle bad data from server', async () => {
    fetch.mockResponseOnce('notjson');
    await renderServerComponent(<Home />);

    // Suppress the error that's logged when fetch() tries to parse invalid
    // JSON in the useWidgetDataFetcher() hook
    const log = vi.spyOn(console, 'log').mockImplementation(() => {
      /* noop */
    });
    await searchPodcasts('ask pastor john');
    log.mockReset();
    expect(
      await screen.findByText('Error Searching for Podcasts')
    ).toBeInTheDocument();
  });
});
