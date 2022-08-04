import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import Home from '../../pages/index';
import podcastFeedJson from '../__json__/podcastFeed.json';
import podcastNoResultsJson from '../__json__/podcastNoResults.json';
import podcastSearchJson from '../__json__/podcastSearch.json';
import { searchPodcasts } from '../__utils__/podcastTestUtils';

describe('Podcast widget', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should choose result via Enter key for accessibility', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    const firstPodcastResult = screen.getByRole('heading', {
      name: 'Sermon of the Day'
    });
    await fireEvent.keyDown(firstPodcastResult, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('50 episodes')).toBeInTheDocument();
    });
  });

  it('should choose result via spacebar for accessibility', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    const firstPodcastResult = screen.getByRole('heading', {
      name: 'Sermon of the Day'
    });
    await fireEvent.keyDown(firstPodcastResult, { key: ' ' });
    await waitFor(() => {
      expect(screen.getByText('50 episodes')).toBeInTheDocument();
    });
  });

  it('should handle no results', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastNoResultsJson));
    render(<Home />);

    await searchPodcasts('abc123xyz');
    expect(screen.getByText('No Podcasts Found')).toBeInTheDocument();
  });

  it('should clear last search results after changing query', async () => {
    render(<Home />);

    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    fetch.mockResponseOnce(JSON.stringify(podcastNoResultsJson));
    await searchPodcasts('abc123xyz');
    expect(screen.queryByText('26 podcasts')).not.toBeInTheDocument();
  });

  it('should handle bad data from server', async () => {
    fetch.mockResponseOnce('notjson');
    render(<Home />);

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
