import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../../pages/index';
import podcastFeedJson from './__json__/podcastFeed.json';
import podcastNoResultsJson from './__json__/podcastNoResults.json';
import podcastSearchJson from './__json__/podcastSearch.json';
import AudioMock from './__mocks__/AudioMock';
import { getWidgetData, waitForWidget } from './__utils__/testUtils';

async function searchPodcasts(podcastQuery: string) {
  await waitForWidget({ type: 'Podcast', index: 3 });
  const searchInput = screen.getAllByRole('searchbox', {
    name: 'Podcast Search Query'
  })[0] as HTMLInputElement;
  searchInput.value = '';
  await userEvent.type(searchInput, podcastQuery);
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
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should search for podcast and select episode', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();
    expect(getWidgetData({ type: 'Podcast', index: 3 })).toHaveProperty(
      'podcastQuery',
      'sermon of the day'
    );

    await choosePodcast('Sermon of the Day');
    expect(screen.getByText('50 episodes')).toBeInTheDocument();
    expect(getWidgetData({ type: 'Podcast', index: 3 })).toHaveProperty(
      'podcastFeedData.title',
      podcastFeedJson.channel.title
    );

    await chooseEpisode('The Beautiful Faith of Fearless Submission');
    expect(
      screen.getByRole('heading', {
        name: 'The Beautiful Faith of Fearless Submission'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Return to List' })
    ).toBeInTheDocument();
    expect(AudioMock.instances).toHaveLength(1);
  });

  it('should return to list from Now Playing screen', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

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
    render(<Home />);

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

  it('should play/pause audio', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    const playStub = jest.spyOn(AudioMock.prototype, 'play');
    const pauseStub = jest.spyOn(AudioMock.prototype, 'pause');
    render(<Home />);

    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('The Beautiful Faith of Fearless Submission');

    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    expect(playStub).not.toHaveBeenCalled();
    expect(AudioMock.instances[0]).not.toBeUndefined();

    await userEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(playStub).toHaveBeenCalled();
    AudioMock.instances[0].paused = false;

    await userEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(pauseStub).toHaveBeenCalled();
    AudioMock.instances[0].paused = true;
  });

  it('should interact with audio seeker', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('The Beautiful Faith of Fearless Submission');

    const audioProgressSlider = screen.getByRole('slider', {
      name: 'Audio Progress'
    }) as HTMLInputElement;
    expect(audioProgressSlider).toBeInTheDocument();

    await fireEvent.input(audioProgressSlider, { target: { value: '10' } });
    await fireEvent.change(audioProgressSlider, { target: { value: '10' } });
    await userEvent.click(audioProgressSlider);
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 10);
  });

  it('should maintain separate audio stream per Podcast widget', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('The Beautiful Faith of Fearless Submission');

    await userEvent.click(screen.getByRole('button', { name: 'Add Widget' }));
    await userEvent.click(
      screen.getByRole('button', { name: `Add Podcast Widget` })
    );
    expect(AudioMock.instances).toHaveLength(2);
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
