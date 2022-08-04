import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../../pages/index';
import podcastFeedJson from '../__json__/podcastFeed.json';
import podcastSearchJson from '../__json__/podcastSearch.json';
import AudioMock from '../__mocks__/AudioMock';
import { navigateToNowPlaying } from '../__utils__/podcastTestUtils';

describe('audio player main controls', () => {
  afterEach(() => {
    jest.restoreAllMocks();
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

  it('should maintain separate audio stream per widget instance', async () => {
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

  it('should indicate when audio is buffering', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);

    await navigateToNowPlaying();
    await userEvent.click(screen.getByRole('button', { name: 'Play' }));
    act(() => {
      AudioMock.instances[0].trigger('waiting');
    });
    expect(screen.queryByText('Loading...')).toBeInTheDocument();
    act(() => {
      AudioMock.instances[0].trigger('playing');
    });
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });
});
