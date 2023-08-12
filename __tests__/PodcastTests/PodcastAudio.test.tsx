import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';
import Home from '../../app/page';
import podcastFeedJson from '../__json__/podcastFeed.json';
import podcastSearchJson from '../__json__/podcastSearch.json';
import AudioMock from '../__mocks__/AudioMock';
import { navigateToNowPlaying } from '../__utils__/podcastTestUtils';
import { renderServerComponent } from '../__utils__/renderServerComponent';

async function seekAudio({ newCurrentTime }: { newCurrentTime: number }) {
  const audioProgressSlider = screen.getByRole('slider', {
    name: 'Audio Progress'
  }) as HTMLInputElement;
  expect(audioProgressSlider).toBeInTheDocument();

  fireEvent.mouseDown(audioProgressSlider);
  fireEvent.input(audioProgressSlider, {
    target: { value: String(newCurrentTime) }
  });
  fireEvent.change(audioProgressSlider, {
    target: { value: String(newCurrentTime) }
  });
  fireEvent.mouseUp(audioProgressSlider);
}

describe('Podcast widget', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should play/pause audio', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    const playStub = jest.spyOn(AudioMock.prototype, 'play');
    const pauseStub = jest.spyOn(AudioMock.prototype, 'pause');
    await renderServerComponent(<Home />);
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
    await renderServerComponent(<Home />);
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
    await renderServerComponent(<Home />);
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
    await renderServerComponent(<Home />);
    await navigateToNowPlaying();

    // 0:10
    await seekAudio({ newCurrentTime: 10 });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 10);
  });

  it('should display audio timestamps correctly when current time is in hours', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    await renderServerComponent(<Home />);
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
    await renderServerComponent(<Home />);
    // 9:30
    AudioMock.instances[0].duration = 570;
    await navigateToNowPlaying();

    // 0:03
    await seekAudio({ newCurrentTime: 3 });
    expect(screen.getByText('0:03')).toBeInTheDocument();
    expect(screen.getByText('-9:27')).toBeInTheDocument();
  });

  it('should maintain separate audio stream per widget', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    await renderServerComponent(<Home />);
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
    await renderServerComponent(<Home />);

    await navigateToNowPlaying();
    await userEvent.click(screen.getByRole('button', { name: 'Play' }));
    await act(async () => {
      AudioMock.instances[0].trigger('waiting');
    });
    expect(screen.queryByText('Loading...')).toBeInTheDocument();
    await act(async () => {
      AudioMock.instances[0].trigger('playing');
    });
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });
});
