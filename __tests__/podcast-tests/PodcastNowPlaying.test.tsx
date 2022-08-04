import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import { omit } from 'lodash-es';
import Home from '../../pages/index';
import podcastFeedJson from '../__json__/podcastFeed.json';
import podcastSearchJson from '../__json__/podcastSearch.json';
import AudioMock from '../__mocks__/AudioMock';
import {
  chooseEpisode,
  choosePodcast,
  navigateToNowPlaying,
  searchPodcasts
} from '../__utils__/podcastTestUtils';

describe('Podcast widget Now Playing', () => {
  afterEach(() => {
    jest.restoreAllMocks();
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
});
