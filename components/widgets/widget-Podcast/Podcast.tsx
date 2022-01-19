import React from 'react';
import useCachedAudio from '../../generic/audio-player/useCachedAudio';
import useCachedState from '../../useCachedState';
import useUniqueFieldId from '../../useUniqueFieldId';
import useWidgetCleanupOnRemove from '../useWidgetCleanupOnRemove';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import useWidgetShell from '../useWidgetShell';
import { WidgetParameters } from '../widget.d';
import WidgetShell from '../WidgetShell';
import { PodcastFeedData, PodcastInfo, PodcastSearchResponse, PodcastWidgetState } from './podcast.d';
import PodcastEpisodeList from './PodcastEpisodeList';
import PodcastNowPlaying from './PodcastNowPlaying';
import PodcastPodcastList from './PodcastPodcastList';
import reducer from './PodcastReducer';

const PodcastWidget = React.memo(function PodcastWidget({ widgetHead, provided }: WidgetParameters) {

  const [state, dispatch] = useWidgetShell(reducer, widgetHead);
  const {
    podcastQuery,
    podcastFeedUrl,
    podcastImage,
    podcastFeedData,
    nowPlaying,
    isPlaying,
    viewingNowPlaying,
    listeningMetadata
  } = state as PodcastWidgetState;
  const nowPlayingMetadata = nowPlaying ? listeningMetadata[nowPlaying.guid] : null;
  const [podcastList, setPodcastList, removePodcastList] = useCachedState(`podcast-list-${state.id}`, () => [] as PodcastInfo[]);

  const [audioElement, removeAudioElement] = useCachedAudio(state.id);

  const { fetchError, submitRequestQuery, requestQueryInputRef } = useWidgetDataFetcher({
    widget: state,
    dispatch,
    shouldFetchInitially: () => podcastQuery && !podcastFeedData,
    requestQuery: podcastQuery,
    setRequestQuery: (newPodcastQuery: typeof podcastQuery) => {
      dispatch({ type: 'setPodcastQuery', payload: newPodcastQuery });
    },
    getApiUrl: (query: typeof podcastQuery) => {
      return `/api/widgets/podcast?q=${encodeURIComponent(query)}`;
    },
    parseResponse: (data: PodcastSearchResponse) => data.results,
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
    getNoResultsMessage: (results: typeof podcastFeedData) => 'No Podcasts Found',
    getErrorMessage: (error: Error) => 'Error Searching for Podcasts'
  });

  const feedFetcher = useWidgetDataFetcher({
    widget: state,
    dispatch,
    shouldFetchInitially: () => podcastFeedUrl && !podcastFeedData,
    fetchFrequency: 'daily',
    requestQuery: podcastFeedUrl,
    setRequestQuery: (newPodcastFeedUrl: typeof podcastFeedUrl) => {
      dispatch({ type: 'setPodcastFeedUrl', payload: newPodcastFeedUrl });
    },
    getApiUrl: (feedUrl: typeof podcastFeedUrl) => {
      return `/api/widgets/podcast/feed?url=${encodeURIComponent(feedUrl)}`;
    },
    parseResponse: (data: {channel: PodcastFeedData}) => data.channel,
    hasResults: (data: typeof podcastFeedData) => data.item && data.item.length,
    onSuccess: (data: typeof podcastFeedData) => {
      dispatch({
        type: 'setPodcastFeedData',
        payload: data
      });
    },
    getNoResultsMessage: (data: typeof podcastFeedData) => 'No Podcasts Found',
    getErrorMessage: (error: Error) => 'Error Fetching Podcast'
  });

  // Pause the audio in case it's still playing when the user removes the
  // widget from their dashboard
  useWidgetCleanupOnRemove(state, () => {
    audioElement.pause();
    removeAudioElement();
    removePodcastList();
  });

  const searchFieldId = useUniqueFieldId('podcast-search');

  return (
    <WidgetShell widget={state} dispatch={dispatch} provided={provided}>
      <section className="podcast">
        {state.isSettingsOpen || !podcastFeedUrl || !podcastFeedData || fetchError ? (
          <div className="podcast-search">
            <form
              className="podcast-settings"
              onSubmit={(event) => submitRequestQuery((event))}>
              <h2 className="podcast-settings-heading">Podcast</h2>
              <label htmlFor={searchFieldId} className="podcast-search accessibility-only">
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
              ref={requestQueryInputRef} />
              <button type="submit" className="podcast-url-submit">Search</button>
              {fetchError ? (
                <p className="podcast-error">{fetchError}</p>
                ) : null}
            </form>
            <PodcastPodcastList
              widget={state}
              podcastList={podcastList}
              fetchPodcastFeed={feedFetcher.fetchWidgetData}
              dispatch={dispatch} />
          </div>
        ) : podcastFeedUrl && podcastFeedData && nowPlaying && viewingNowPlaying ? (
          <PodcastNowPlaying
            widget={state}
            podcastFeedData={podcastFeedData}
            podcastImage={podcastImage}
            nowPlaying={nowPlaying}
            nowPlayingMetadata={nowPlayingMetadata}
            isPlaying={isPlaying}
            dispatch={dispatch} />
        ) : podcastFeedUrl && podcastFeedData && !viewingNowPlaying ? (
          <PodcastEpisodeList
            podcastFeedUrl={podcastFeedUrl}
            podcastFeedData={podcastFeedData}
            nowPlaying={nowPlaying}
            fetchPodcastFeed={feedFetcher.fetchWidgetData}
            dispatch={dispatch} />
        ) : null}
      </section>
    </WidgetShell>
  );

});

export default PodcastWidget;
