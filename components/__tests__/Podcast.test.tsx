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
  await waitFor(() => {
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

async function choosePodcast(podcastTitle: string) {
  const firstPodcastResult = screen.getByRole('heading', {
    name: podcastTitle
  });
  expect(firstPodcastResult).toBeInTheDocument();
  await userEvent.click(firstPodcastResult);
}

async function chooseEpisode(episodeTitle: string) {
  await userEvent.click(
    screen.getByRole('heading', {
      name: episodeTitle
    })
  );
}

describe('Podcast widget', () => {
  it('should search for podcast and select episode', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    await choosePodcast('Sermon of the Day');
    expect(screen.getByText('50 episodes')).toBeInTheDocument();

    await chooseEpisode('The Beautiful Faith of Fearless Submission');
    expect(
      screen.getByRole('heading', {
        name: 'The Beautiful Faith of Fearless Submission'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Return to List' })
    ).toBeInTheDocument();
  });

  it('should return to list from Now Playing screen', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    await choosePodcast('Sermon of the Day');
    expect(screen.getByText('50 episodes')).toBeInTheDocument();

    await chooseEpisode('The Beautiful Faith of Fearless Submission');
    await userEvent.click(
      screen.getByRole('button', { name: 'Return to List' })
    );
    expect(screen.getByText('50 episodes')).toBeInTheDocument();
  });

  it('should access Now Playing screen from episode list', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    await choosePodcast('Sermon of the Day');
    expect(screen.getByText('50 episodes')).toBeInTheDocument();

    await chooseEpisode('The Beautiful Faith of Fearless Submission');
    await userEvent.click(
      screen.getByRole('button', { name: 'Return to List' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Now Playing' }));
    expect(
      screen.getByRole('heading', {
        name: 'The Beautiful Faith of Fearless Submission'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Return to List' })
    ).toBeInTheDocument();
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
