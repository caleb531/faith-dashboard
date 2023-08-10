import React from 'react';
import useCachedAudio from '../../reusable/audio-player/useCachedAudio';
import useCachedState from '../../useCachedState';
import useMediaSession from '../../useMediaSession';
import WidgetShell from '../WidgetShell';
import useWidgetCleanupOnRemove from '../useWidgetCleanupOnRemove';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import useWidgetShell from '../useWidgetShell';
import { WidgetParameters } from '../widget.types';
import PodcastContext from './PodcastContext';
import PodcastEpisodeList from './PodcastEpisodeList';
import PodcastNowPlaying from './PodcastNowPlaying';
import reducer from './PodcastReducer';
import PodcastSettings from './PodcastSettings';
import {
  PodcastFeedData,
  PodcastInfo,
  PodcastSearchResponse
} from './podcast.types';

const PodcastWidget = React.memo(function PodcastWidget({
  widgetHead,
  provided
}: WidgetParameters) {
  const [widget, dispatchToWidget] = useWidgetShell(reducer, widgetHead);
  const {
    podcastQuery,
    podcastFeedUrl,
    podcastFeedData,
    nowPlaying,
    isPlaying,
    viewingNowPlaying
  } = widget;

  const [podcastList, setPodcastList, removePodcastList] = useCachedState(
    `podcast-list-${widget.id}`,
    () => [] as PodcastInfo[]
  );

  const [audioElement, removeAudioElement] = useCachedAudio(widget.id);

  const podcastFetcher = useWidgetDataFetcher({
    widget,
    dispatchToWidget,
    shouldFetchInitially: () => false,
    requestQuery: podcastQuery,
    setRequestQuery: (newPodcastQuery: typeof podcastQuery) => {
      removePodcastList();
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
    getNoResultsMessage: () => 'No Podcasts Found',
    getErrorMessage: () => 'Error Searching for Podcasts'
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
    audioElement
  });

  // Pause the audio in case it's still playing when the user removes the
  // widget from their dashboard
  useWidgetCleanupOnRemove(widget, () => {
    audioElement.pause();
    clearMediaSession();
    removeAudioElement();
    removePodcastList();
  });

  return (
    <WidgetShell
      widget={widget}
      dispatchToWidget={dispatchToWidget}
      provided={provided}
    >
      <PodcastContext.Provider value={dispatchToWidget}>
        <section className="podcast">
          {widget.isSettingsOpen ||
          !podcastFeedUrl ||
          !podcastFeedData ||
          podcastFetcher.fetchError ? (
            <PodcastSettings
              podcastQuery={podcastQuery}
              podcastFetcher={podcastFetcher}
              feedFetcher={feedFetcher}
              podcastList={podcastList}
            />
          ) : podcastFeedUrl &&
            podcastFeedData &&
            nowPlaying &&
            viewingNowPlaying ? (
            <PodcastNowPlaying
              widget={widget}
              nowPlaying={nowPlaying}
              isPlaying={isPlaying}
            />
          ) : podcastFeedUrl && podcastFeedData && !viewingNowPlaying ? (
            <PodcastEpisodeList
              widget={widget}
              nowPlaying={nowPlaying}
              fetchPodcastFeed={feedFetcher.fetchWidgetData}
            />
          ) : null}
        </section>
      </PodcastContext.Provider>
    </WidgetShell>
  );
});

export default PodcastWidget;
