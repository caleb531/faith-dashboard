import React from 'react';
import useCachedAudio from '../../generic/audio-player/useCachedAudio';
import useCachedState from '../../useCachedState';
import useMediaSession from '../../useMediaSession';
import useUniqueFieldId from '../../useUniqueFieldId';
import useWidgetCleanupOnRemove from '../useWidgetCleanupOnRemove';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import useWidgetShell from '../useWidgetShell';
import { WidgetParameters } from '../widget.d';
import WidgetShell from '../WidgetShell';
import {
  PodcastFeedData,
  PodcastInfo,
  PodcastSearchResponse,
  PodcastWidgetState
} from './podcast.d';
import PodcastEpisodeList from './PodcastEpisodeList';
import PodcastNowPlaying from './PodcastNowPlaying';
import PodcastPodcastList from './PodcastPodcastList';
import reducer from './PodcastReducer';

const PodcastWidget = React.memo(function PodcastWidget({
  widgetHead,
  provided
}: WidgetParameters) {
  const [widget, dispatchToWidget] = useWidgetShell(reducer, widgetHead);
  const {
    podcastQuery,
    podcastFeedUrl,
    podcastImage,
    podcastFeedData,
    nowPlaying,
    isPlaying,
    viewingNowPlaying,
    listeningMetadata
  } = widget as PodcastWidgetState;
  const nowPlayingMetadata = nowPlaying
    ? listeningMetadata[nowPlaying.guid]
    : null;
  const [podcastList, setPodcastList, removePodcastList] = useCachedState(
    `podcast-list-${widget.id}`,
    () => [] as PodcastInfo[]
  );

  const [audioElement, removeAudioElement] = useCachedAudio(widget.id);

  const { fetchError, submitRequestQuery, requestQueryInputRef } =
    useWidgetDataFetcher({
      widget,
      dispatchToWidget,
      shouldFetchInitially: () => podcastQuery && !podcastFeedData,
      requestQuery: podcastQuery,
      setRequestQuery: (newPodcastQuery: typeof podcastQuery) => {
        dispatchToWidget({ type: 'setPodcastQuery', payload: newPodcastQuery });
      },
      getApiUrl: (query: typeof podcastQuery) => {
        return `/api/widgets/podcast?q=${encodeURIComponent(query)}`;
      },
      parseResponse: (response: PodcastSearchResponse) => response.results,
      hasResults: (results: typeof podcastList) => results && results.length,
      onSuccess: (results: typeof podcastList) => {
        // When the user searches with a new query, access is lost to the Now
        // Playing UI, since the feed URL has been reset (which is necessary in
        // order for the UX to flow properly); however, the Audio element may
        // still be playing from the previous podcast, so we must stop the audio
        // since the user can't control it anyway
        audioElement.pause();
        setPodcastList(results);
      },
      getNoResultsMessage: (results: typeof podcastList) => 'No Podcasts Found',
      getErrorMessage: (error: Error) => 'Error Searching for Podcasts'
    });

  const feedFetcher = useWidgetDataFetcher({
    widget,
    dispatchToWidget,
    shouldFetchInitially: () => podcastFeedUrl && !podcastFeedData,
    fetchFrequency: 'daily',
    requestQuery: podcastFeedUrl || '',
    setRequestQuery: (newPodcastFeedUrl: typeof podcastFeedUrl) => {
      dispatchToWidget({
        type: 'setPodcastFeedUrl',
        payload: newPodcastFeedUrl
      });
    },
    getApiUrl: (feedUrl: typeof podcastFeedUrl) => {
      return `/api/widgets/podcast/feed?url=${encodeURIComponent(
        feedUrl || ''
      )}`;
    },
    parseResponse: (data: { channel: PodcastFeedData }) => data.channel,
    hasResults: (data: typeof podcastFeedData) =>
      data && data.item && data.item.length,
    onSuccess: (data: typeof podcastFeedData) => {
      dispatchToWidget({
        type: 'setPodcastFeedData',
        payload: data
      });
    },
    getNoResultsMessage: (data: typeof podcastFeedData) => 'No Podcasts Found',
    getErrorMessage: (error: Error) => 'Error Fetching Podcast'
  });

  const [clearMediaSession] = useMediaSession({
    title: nowPlaying?.title,
    artist: podcastFeedData?.['itunes:author'],
    album: podcastFeedData?.title,
    artwork: podcastFeedData?.['itunes:image']
      ? [{ src: podcastFeedData['itunes:image'].href }]
      : [],
    audioElement,
    defaultSeekBackwardOffset: 15,
    defaultSeekForwardOffset: 15
  });

  // Pause the audio in case it's still playing when the user removes the
  // widget from their dashboard
  useWidgetCleanupOnRemove(widget, () => {
    audioElement.pause();
    clearMediaSession();
    removeAudioElement();
    removePodcastList();
  });

  const searchFieldId = useUniqueFieldId('podcast-search');

  return (
    <WidgetShell
      widget={widget}
      dispatchToWidget={dispatchToWidget}
      provided={provided}
    >
      <section className="podcast">
        {widget.isSettingsOpen ||
        !podcastFeedUrl ||
        !podcastFeedData ||
        fetchError ? (
          <div className="podcast-search">
            <form
              className="podcast-settings"
              onSubmit={(event) => submitRequestQuery(event)}
            >
              <h2 className="podcast-settings-heading">Podcast</h2>
              <label
                htmlFor={searchFieldId}
                className="podcast-search accessibility-only"
              >
                Search Query
              </label>
              <input
                type="search"
                id={searchFieldId}
                className="podcast-search"
                name="search"
                defaultValue={podcastQuery}
                placeholder="Search for podcasts"
                required
                ref={requestQueryInputRef}
              />
              <button type="submit" className="podcast-url-submit">
                Search
              </button>
              {fetchError ? (
                <p className="podcast-error">{fetchError}</p>
              ) : null}
            </form>
            <PodcastPodcastList
              podcastList={podcastList}
              fetchPodcastFeed={feedFetcher.fetchWidgetData}
              dispatchToWidget={dispatchToWidget}
            />
          </div>
        ) : podcastFeedUrl &&
          podcastFeedData &&
          nowPlaying &&
          viewingNowPlaying ? (
          <PodcastNowPlaying
            widget={widget}
            podcastFeedData={podcastFeedData}
            podcastImage={podcastImage}
            nowPlaying={nowPlaying}
            nowPlayingMetadata={nowPlayingMetadata}
            isPlaying={isPlaying}
            dispatchToWidget={dispatchToWidget}
          />
        ) : podcastFeedUrl && podcastFeedData && !viewingNowPlaying ? (
          <PodcastEpisodeList
            podcastFeedUrl={podcastFeedUrl}
            podcastFeedData={podcastFeedData}
            nowPlaying={nowPlaying}
            fetchPodcastFeed={feedFetcher.fetchWidgetData}
            dispatchToWidget={dispatchToWidget}
          />
        ) : null}
      </section>
    </WidgetShell>
  );
});

export default PodcastWidget;
