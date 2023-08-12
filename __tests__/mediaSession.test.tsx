import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import Home from '../app/page';
import podcastFeedJson from './__json__/podcastFeed.json';
import podcastSearchJson from './__json__/podcastSearch.json';
import AudioMock from './__mocks__/AudioMock';
import { mediaSessionMock } from './__mocks__/mediaSessionMock';
import { navigateToNowPlaying } from './__utils__/podcastTestUtils';

describe('media session', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should populate', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await navigateToNowPlaying();
    await waitFor(() => {
      expect(navigator.mediaSession.metadata).not.toEqual(null);
    });
  });

  it('should not error if client does not support Media Session API', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    Object.defineProperty(navigator, 'mediaSession', {
      value: undefined
    });
    render(<Home />);
    expect(navigator.mediaSession).toEqual(undefined);
    await navigateToNowPlaying();
    expect(navigator.mediaSession).toEqual(undefined);
  });

  it('should play', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await navigateToNowPlaying();
    expect(AudioMock.instances[0]).toHaveProperty('paused', true);
    await act(async () => {
      mediaSessionMock._triggerAction('play');
    });
    expect(AudioMock.instances[0]).toHaveProperty('paused', false);
  });

  it('should pause', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    jest.spyOn(AudioMock.instances[0], 'pause');
    await navigateToNowPlaying();
    expect(AudioMock.instances[0]).toHaveProperty('paused', true);
    await act(async () => {
      mediaSessionMock._triggerAction('pause');
    });
    expect(AudioMock.instances[0].pause).toHaveBeenCalled();
    expect(AudioMock.instances[0]).toHaveProperty('paused', true);
  });

  it('should seek to specified position', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await navigateToNowPlaying();
    await act(async () => {
      mediaSessionMock._triggerAction('seekto', { seekTime: 123 });
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 123);
  });

  it('should fast seek to specified position', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await navigateToNowPlaying();
    jest.spyOn(AudioMock.instances[0], 'fastSeek');
    await act(async () => {
      mediaSessionMock._triggerAction('seekto', {
        seekTime: 123,
        fastSeek: true
      });
    });
    expect(AudioMock.instances[0].fastSeek).toHaveBeenCalled();
  });

  it('should seek forward by default offset', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await navigateToNowPlaying();
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 0);
    await act(async () => {
      mediaSessionMock._triggerAction('seekforward');
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 15);
  });

  it('should seek forward by provided offset', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await navigateToNowPlaying();
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 0);
    await act(async () => {
      mediaSessionMock._triggerAction('seekforward', { seekOffset: 10 });
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 10);
  });

  it('should seek backward by default offset', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await navigateToNowPlaying();
    AudioMock.instances[0].currentTime = 60;
    await act(async () => {
      mediaSessionMock._triggerAction('seekbackward');
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 45);
  });

  it('should seek backward by provided offset', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await navigateToNowPlaying();
    AudioMock.instances[0].currentTime = 60;
    await act(async () => {
      mediaSessionMock._triggerAction('seekbackward', { seekOffset: 10 });
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 50);
  });
});
