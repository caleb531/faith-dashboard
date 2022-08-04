import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import Home from '../../pages/index';
import podcastFeedJson from '../__json__/podcastFeed.json';
import podcastSearchJson from '../__json__/podcastSearch.json';
import AudioMock from '../__mocks__/AudioMock';
import { navigateToNowPlaying } from '../__utils__/podcastTestUtils';

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

describe('audio player seeker', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be interactive', async () => {
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
});
