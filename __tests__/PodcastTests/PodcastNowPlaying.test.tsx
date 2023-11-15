import Home from '@app/page';
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import podcastFeedJson from '@tests/__json__/podcastFeed.json';
import podcastSearchJson from '@tests/__json__/podcastSearch.json';
import AudioMock from '@tests/__mocks__/AudioMock';
import fetch from '@tests/__mocks__/fetchMock';
import {
  chooseEpisode,
  choosePodcast,
  navigateToNowPlaying,
  searchPodcasts
} from '@tests/__utils__/podcastTestUtils';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';

import { omit } from 'lodash-es';

describe('Podcast widget', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should access Now Playing screen from episode list', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    await renderServerComponent(<Home />);

    await searchPodcasts('sermon of the day');
    expect(await screen.findByText('26 podcasts')).toBeInTheDocument();

    await choosePodcast('Sermon of the Day');
    expect(await screen.findByText('50 episodes')).toBeInTheDocument();

    await chooseEpisode('Perfect Love Casts Out Fear');
    await waitFor(() => {
      expect(AudioMock.instances[0]).toHaveProperty('duration', 60);
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Return to List' })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Now Playing' }));
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
    await renderServerComponent(<Home />);
    await navigateToNowPlaying();

    expect(await screen.findByTestId('podcast-image')).toHaveProperty(
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
    await renderServerComponent(<Home />);
    await navigateToNowPlaying();

    expect(await screen.findByTestId('podcast-image')).toHaveTextContent('?');
  });
});
