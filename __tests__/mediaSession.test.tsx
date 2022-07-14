import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import fetch from 'jest-fetch-mock';
import Home from '../pages/index';
import podcastFeedJson from './__json__/podcastFeed.json';
import podcastSearchJson from './__json__/podcastSearch.json';
import AudioMock from './__mocks__/AudioMock';
import { mediaSessionMock } from './__mocks__/mediaSessionMock';
import {
  chooseEpisode,
  choosePodcast,
  searchPodcasts
} from './__utils__/podcastTestUtils';

describe('media session', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should populate', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('Perfect Love Casts Out Fear');
    expect(navigator.mediaSession.metadata).not.toEqual(null);
  });

  it('should play', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('Perfect Love Casts Out Fear');
    expect(AudioMock.instances[0]).toHaveProperty('paused', true);
    act(() => {
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
    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('Perfect Love Casts Out Fear');
    expect(AudioMock.instances[0]).toHaveProperty('paused', true);
    act(() => {
      mediaSessionMock._triggerAction('pause');
    });
    expect(AudioMock.instances[0].pause).toHaveBeenCalled();
    expect(AudioMock.instances[0]).toHaveProperty('paused', true);
  });

  it('should seek forward by default offset', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('Perfect Love Casts Out Fear');
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 0);
    act(() => {
      mediaSessionMock._triggerAction('seekforward');
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 15);
  });

  it('should seek forward by provided offset', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('Perfect Love Casts Out Fear');
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 0);
    act(() => {
      mediaSessionMock._triggerAction('seekforward', { seekOffset: 10 });
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 10);
  });

  it('should seek backward by default offset', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('Perfect Love Casts Out Fear');
    AudioMock.instances[0].currentTime = 60;
    act(() => {
      mediaSessionMock._triggerAction('seekbackward');
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 45);
  });

  it('should seek backward by provided offset', async () => {
    fetch.mockResponseOnce(JSON.stringify(podcastSearchJson));
    fetch.mockResponseOnce(JSON.stringify(podcastFeedJson));
    render(<Home />);
    expect(navigator.mediaSession.metadata).toEqual(null);
    await searchPodcasts('sermon of the day');
    await choosePodcast('Sermon of the Day');
    await chooseEpisode('Perfect Love Casts Out Fear');
    AudioMock.instances[0].currentTime = 60;
    act(() => {
      mediaSessionMock._triggerAction('seekbackward', { seekOffset: 10 });
    });
    expect(AudioMock.instances[0]).toHaveProperty('currentTime', 50);
  });
});
