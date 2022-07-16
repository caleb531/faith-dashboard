import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../pages/index';
import podcastFeedJson from './__json__/podcastFeed.json';
import podcastNoResultsJson from './__json__/podcastNoResults.json';
import podcastSearchJson from './__json__/podcastSearch.json';
import AudioMock from './__mocks__/AudioMock';
import {
  chooseEpisode,
  choosePodcast,
  searchPodcasts
} from './__utils__/podcastTestUtils';
import { getWidgetData } from './__utils__/testUtils';

async function navigateToNowPlaying() {
  await searchPodcasts('sermon of the day');
  await choosePodcast('Sermon of the Day');
  await chooseEpisode('Perfect Love Casts Out Fear');
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

    await chooseEpisode('Perfect Love Casts Out Fear');
    expect(
      screen.getByRole('heading', {
        name: 'Perfect Love Casts Out Fear'
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

    await chooseEpisode('Perfect Love Casts Out Fear');
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

    await chooseEpisode('Perfect Love Casts Out Fear');
    await userEvent.click(
      screen.getByRole('button', { name: 'Return to List' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Now Playing' }));
    expect(
      screen.getByRole('heading', {
        name: 'Perfect Love Casts Out Fear'
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
    await navigateToNowPlaying();

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

  it('should skip back in audio', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    await navigateToNowPlaying();

    AudioMock.instances[0].currentTime = 123;
    await userEvent.click(
      screen.getByRole('button', { name: 'Skip Back 10 Seconds' })
    );
    AudioMock.instances[0].currentTime = 113;
  });
  it('should skip forward in audio', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    await navigateToNowPlaying();

    AudioMock.instances[0].currentTime = 123;
    await userEvent.click(
      screen.getByRole('button', { name: 'Skip Forward 30 Seconds' })
    );
    AudioMock.instances[0].currentTime = 153;
  });

  it('should interact with audio seeker', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    await navigateToNowPlaying();

    const audioProgressSlider = screen.getByRole('slider', {
      name: 'Audio Progress'
    }) as HTMLInputElement;
    expect(audioProgressSlider).toBeInTheDocument();

    // 0:10
    await fireEvent.mouseDown(audioProgressSlider);
    await fireEvent.input(audioProgressSlider, { target: { value: '10' } });
    await fireEvent.change(audioProgressSlider, { target: { value: '10' } });
    await fireEvent.mouseUp(audioProgressSlider);
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 10);
  });

  it('should display audio timestamps correctly when current time is in hours', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    // 1:18:32
    AudioMock.instances[0].duration = 4712;
    await navigateToNowPlaying();

    const audioProgressSlider = screen.getByRole('slider', {
      name: 'Audio Progress'
    }) as HTMLInputElement;
    expect(audioProgressSlider).toBeInTheDocument();

    // 1:04:03
    await fireEvent.mouseDown(audioProgressSlider);
    await fireEvent.input(audioProgressSlider, { target: { value: '3843' } });
    await fireEvent.change(audioProgressSlider, { target: { value: '3843' } });
    await fireEvent.mouseUp(audioProgressSlider);
    expect(screen.getByText('1:04:03')).toBeInTheDocument();
    expect(screen.getByText('-14:29')).toBeInTheDocument();
  });

  it('should display audio timestamps correctly when current time is in seconds', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    // 9:30
    AudioMock.instances[0].duration = 570;
    await navigateToNowPlaying();

    const audioProgressSlider = screen.getByRole('slider', {
      name: 'Audio Progress'
    }) as HTMLInputElement;
    expect(audioProgressSlider).toBeInTheDocument();

    // 0:03
    await fireEvent.mouseDown(audioProgressSlider);
    await fireEvent.input(audioProgressSlider, { target: { value: '3' } });
    await fireEvent.change(audioProgressSlider, { target: { value: '3' } });
    await fireEvent.mouseUp(audioProgressSlider);
    expect(screen.getByText('0:03')).toBeInTheDocument();
    expect(screen.getByText('-9:27')).toBeInTheDocument();
  });

  it('should maintain separate audio stream per Podcast widget', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    await navigateToNowPlaying();

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
