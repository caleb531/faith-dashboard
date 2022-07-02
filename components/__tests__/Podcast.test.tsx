import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../../pages/index';
import podcastFeedJson from './__json__/podcastFeed.json';
import podcastNoResultsJson from './__json__/podcastNoResults.json';
import podcastSearchJson from './__json__/podcastSearch.json';

async function searchPodcasts(podcastQuery: string) {
  render(<Home />);
  await waitFor(async () => {
    expect(screen.getAllByRole('article')[3]).toHaveProperty(
      'dataset.widgetType',
      'Podcast'
    );
  });
  await userEvent.type(
    screen.getAllByRole('searchbox', { name: 'Podcast Search Query' })[0],
    podcastQuery
  );
  await userEvent.click(screen.getAllByRole('button', { name: 'Search' })[2]);
}

describe('Podcast widget', () => {
  it('should search for and select podcast', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));

    await searchPodcasts('sermon of the day');
    const firstPodcastResult = screen.getByRole('heading', {
      name: 'Sermon of the Day'
    });
    expect(firstPodcastResult).toBeInTheDocument();
    await userEvent.click(firstPodcastResult);
    const latestEpisodeResult = screen.getByRole('heading', {
      name: 'The Beautiful Faith of Fearless Submission'
    });
    expect(latestEpisodeResult).toBeInTheDocument();
  });

  it('should handle no results', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastNoResultsJson));

    await searchPodcasts('abc123xyz');
    expect(screen.getByText('No Podcasts Found')).toBeInTheDocument();
  });

  it('should handle bad data from server', async () => {
    fetch.mockResponseOnce('notjson');

    // Suppress the error that's logged when fetch() tries to parse invalid
    // JSON in the useWidgetDataFetcher() hook
    const log = jest.spyOn(console, 'log').mockImplementation(() => {
      /* noop */
    });
    await searchPodcasts('ask pastor john');
    log.mockReset();
    expect(
      screen.getByText('Error Searching for Podcasts')
    ).toBeInTheDocument();
  });
});
