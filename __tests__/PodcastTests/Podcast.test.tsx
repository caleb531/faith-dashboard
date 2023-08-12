import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../../app/page';
import podcastFeedJson from '../__json__/podcastFeed.json';
import podcastFeedRefreshedJson from '../__json__/podcastFeedRefreshed.json';
import podcastSearchJson from '../__json__/podcastSearch.json';
import AudioMock from '../__mocks__/AudioMock';
import {
  chooseEpisode,
  choosePodcast,
  searchPodcasts
} from '../__utils__/podcastTestUtils';
import { getWidgetData } from '../__utils__/testUtils';

describe('Podcast widget', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should search for podcast and select episode', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(await Home());

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
    render(await Home());

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
    render(await Home());

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
    render(await Home());

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    const firstPodcastResult = screen.getByRole('heading', {
      name: 'Sermon of the Day'
    });
    fireEvent.keyDown(firstPodcastResult, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('50 episodes')).toBeInTheDocument();
    });
  });

  it('should choose result via spacebar for accessibility', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(await Home());

    await searchPodcasts('sermon of the day');
    expect(screen.getByText('26 podcasts')).toBeInTheDocument();

    const firstPodcastResult = screen.getByRole('heading', {
      name: 'Sermon of the Day'
    });
    fireEvent.keyDown(firstPodcastResult, { key: ' ' });
    await waitFor(() => {
      expect(screen.getByText('50 episodes')).toBeInTheDocument();
    });
  });
});
