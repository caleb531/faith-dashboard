import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../../pages/index';
import podcastFeedJson from './__json__/podcastFeed.json';
import podcastSearchJson from './__json__/podcastSearch.json';

describe('Podcast widget', () => {
  it('should search for and select podcast', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));

    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')[3]).toHaveProperty(
        'dataset.widgetType',
        'Podcast'
      );
    });
    await userEvent.type(
      screen.getAllByRole('searchbox', { name: 'Podcast Search Query' })[0],
      'sermon of the day'
    );
    await userEvent.click(screen.getAllByRole('button', { name: 'Search' })[2]);
    const firstPodcastResult = screen.getByRole('heading', {
      name: 'Sermon of the Day'
    });
    expect(firstPodcastResult).toBeInTheDocument();
    await userEvent.click(firstPodcastResult);
    const latestEpisodeResult = screen.getByRole('heading', {
      name: 'The Beautiful Faith of Fearless Submission'
    });
    expect(latestEpisodeResult).toBeInTheDocument();
  });
});
