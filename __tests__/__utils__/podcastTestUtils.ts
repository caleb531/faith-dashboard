import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import podcastFeedJson from '../__json__/podcastFeed.json';
import podcastSearchJson from '../__json__/podcastSearch.json';
import { waitForWidget } from './testUtils';

export async function searchPodcasts(podcastQuery: string) {
  await waitForWidget({ type: 'Podcast', index: 3 });
  const searchInput = screen.getAllByRole('searchbox', {
    name: 'Podcast Search Query'
  })[0] as HTMLInputElement;
  searchInput.value = '';
  await userEvent.type(searchInput, podcastQuery);
  await userEvent.click(screen.getAllByRole('button', { name: 'Search' })[2]);
}

export async function choosePodcast(podcastTitle: string) {
  const firstPodcastResult = screen.getByRole('heading', {
    name: podcastTitle
  });
  expect(firstPodcastResult).toBeInTheDocument();
  await userEvent.click(firstPodcastResult);
}

export async function chooseEpisode(episodeTitle: string) {
  await userEvent.click(
    screen.getByRole('heading', {
      name: episodeTitle
    })
  );
  // Wait for audio to load
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });
}

export async function navigateToNowPlaying() {
  await searchPodcasts(podcastSearchJson.results[0].trackName.toLowerCase());
  await choosePodcast(podcastSearchJson.results[0].trackName);
  await chooseEpisode(podcastFeedJson.channel.item[0].title);
}
