import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
}