import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import { omit } from 'lodash-es';
import Home from '../pages/index';
import podcastFeedJson from './__json__/podcastFeed.json';
import podcastFeedRefreshedJson from './__json__/podcastFeedRefreshed.json';
import podcastNoResultsJson from './__json__/podcastNoResults.json';
import podcastSearchJson from './__json__/podcastSearch.json';
import AudioMock from './__mocks__/AudioMock';
import {
  chooseEpisode,
  choosePodcast,
  navigateToNowPlaying,
  searchPodcasts
} from './__utils__/podcastTestUtils';
import { getWidgetData } from './__utils__/testUtils';

async function seekAudio({ newCurrentTime }: { newCurrentTime: number }) {
  const audioProgressSlider = screen.getByRole('slider', {
    name: 'Audio Progress'
  }) as HTMLInputElement;
  expect(audioProgressSlider).toBeInTheDocument();

  await fireEvent.mouseDown(audioProgressSlider);
  await fireEvent.input(audioProgressSlider, {
    target: { value: String(newCurrentTime) }
  });
  await fireEvent.change(audioProgressSlider, {
    target: { value: String(newCurrentTime) }
  });
  await fireEvent.mouseUp(audioProgressSlider);
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
    expect(
      screen.getByRole('heading', {
        name: 'The Beautiful Faith of Fearless Submission'
      })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(getWidgetData({ type: 'Podcast', index: 3 })).toHaveProperty(
        'podcastFeedData.title',
        podcastFeedJson.channel.title
      );
    });

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

  it('should refresh feed via manual Refresh control', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedRefreshedJson));
    render(<Home />);

    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    expect(
      screen.queryByRole('heading', { name: 'Let Marriage Be Held in Honor' })
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Check for New Episodes' })
    );
    expect(
      screen.getByRole('heading', { name: 'Let Marriage Be Held in Honor' })
    ).toBeInTheDocument();
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

  it('should access Now Playing screen from episode list', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    await choosePodcast('Sermon of the Day');
    expect(screen.getByText('50 episodes')).toBeInTheDocument();

    await chooseEpisode('Perfect Love Casts Out Fear');
    await waitFor(() => {
      expect(AudioMock.instances[0]).toHaveProperty('duration', 60);
    });
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

    // 0:10
    await seekAudio({ newCurrentTime: 10 });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 10);
  });

  it('should display audio timestamps correctly when current time is in hours', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    // 1:18:32
    AudioMock.instances[0].duration = 4712;
    await navigateToNowPlaying();

    // 1:04:03
    await seekAudio({ newCurrentTime: 3843 });
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

    // 0:03
    await seekAudio({ newCurrentTime: 3 });
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
    await waitFor(() => {
      expect(
        screen.getByText('Error Searching for Podcasts')
      ).toBeInTheDocument();
    });
  });

  it('should display correctly-sized thumbnail', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    await navigateToNowPlaying();

    expect(screen.getByTestId('podcast-image')).toHaveProperty(
      'src',
      'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/53/59/38/535938be-7e7b-554b-841b-53136de28029/mza_12935232606719538957.jpg/100x100bb.jpg'
    );
  });

  it('should display correct placeholder for missing thumbnail', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        ...podcastSearchJson,
        results: podcastSearchJson.results.map((result) => {
          return omit(result, [
            'artworkUrl30',
            'artworkUrl60',
            'artworkUrl100'
          ]);
        })
      })
    );
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    await navigateToNowPlaying();

    expect(screen.getByTestId('podcast-image')).toHaveTextContent('?');
  });

  it('should indicate when audio is buffering', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

    await navigateToNowPlaying();
    await userEvent.click(screen.getByRole('button', { name: 'Play' }));
    await act(() => {
      AudioMock.instances[0].trigger('waiting');
    });
    expect(screen.queryByText('Loading...')).toBeInTheDocument();
    await act(() => {
      AudioMock.instances[0].trigger('playing');
    });
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });
});
