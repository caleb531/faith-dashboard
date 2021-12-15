import React from 'react';
import useCachedAudio from '../../generic/audio-player/useCachedAudio';
import { StateAction } from '../../global.d';
import useCachedState from '../../useCachedState';
import useUniqueFieldId from '../../useUniqueFieldId';
import useWidgetCleanupOnRemove from '../useWidgetCleanupOnRemove';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import useWidgetShell from '../useWidgetShell';
import { WidgetParameters } from '../widget.d';
import WidgetShell from '../WidgetShell';
import { PodcastFeedData, PodcastInfo, PodcastListeningMetadataEntry, PodcastSearchResponse, PodcastWidgetState } from './podcast.d';
import PodcastEpisodeList from './PodcastEpisodeList';
import PodcastNowPlaying from './PodcastNowPlaying';
import PodcastPodcastList from './PodcastPodcastList';

export function reducer(state: PodcastWidgetState, action: StateAction): PodcastWidgetState {
  switch (action.type) {
    case 'setPodcastFeedData':
      const podcastFeedData = action.payload as PodcastFeedData;
      return {
        ...state,
        podcastFeedData: {
          ...podcastFeedData,
          item: podcastFeedData.item
            // Some podcasts have bad data episode details without any media
            // information attached to them; filter these out
            .filter((episode) => episode.enclosure)
            .map((episode) => {
              return {
                ...episode,
                // For most podcasts the GUID for each episode will be unique
                // and safe to use throughout this application; however, some
                // podcasts use the same @attributes object for each and every
                // one of their episode GUIDs; this will cause React to throw a
                // "two children with the same key" error, since we use the
                // GUID to uniquely identify an episode in many areas of the
                // Podcast widget code; to solve this, we need to assign some
                // other value from the episode schema as the GUID (and it
                // can't be something we generate ourselves because the GUID
                // cannot change across feed refreshes, lest we lose listening
                // history, etc.)
                guid: typeof episode.guid !== 'string' ?
                  (episode.enclosure['@attributes'].url || episode.title) :
                  episode.guid
              };
            })
        }
      };
    case 'setPodcastQuery':
      const podcastQuery = action.payload as string;
      return {
        ...state,
        podcastQuery,
        podcastFeedUrl: null
      };
    case 'setPodcastFeedUrl':
      const podcastFeedUrl = action.payload as string;
      return {
        ...state,
        podcastFeedUrl,
        podcastFeedData: null,
        // Reset the transient metadata about the currently playing episode and
        // listening history whenever the podcast feed changes
        nowPlaying: state.podcastFeedUrl !== podcastFeedUrl ?
          null :
          state.nowPlaying || null,
        viewingNowPlaying: false,
        listeningMetadata: state.podcastFeedUrl !== podcastFeedUrl ?
          {} :
          state.listeningMetadata || {}
      };
    case 'setPodcastImage':
      const podcastImage = action.payload as string;
      return { ...state, podcastImage };
    case 'setNowPlaying':
      const nowPlayingEpisodeGuid = action.payload as string;
      return {
        ...state,
        nowPlaying: state.podcastFeedData.item.find((episode) => episode.guid === nowPlayingEpisodeGuid),
        isPlaying: false,
        viewingNowPlaying: true
      };
    case 'setIsPlaying':
      const isPlaying = action.payload as boolean;
      return { ...state, isPlaying };
    case 'setViewingNowPlaying':
      const viewingNowPlaying = action.payload as boolean;
      return { ...state, viewingNowPlaying };
    case 'updateNowPlayingMetadata':
      const metadataEntry = action.payload as PodcastListeningMetadataEntry;
      return {
        ...state,
        listeningMetadata: state.nowPlaying ?
          {
            ...state.listeningMetadata,
            [state.nowPlaying.guid]: { ...state.listeningMetadata[state.nowPlaying.guid], ...metadataEntry }
          } :
          state.listeningMetadata
      };
    default:
      throw new ReferenceError(`action ${action.type} does not exist on reducer`);
  }
}

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
  const [podcastList, setPodcastList] = useCachedState<PodcastInfo[]>(`podcast-list-for-widget-${state.id}`, () => []);

  const audioElement = useCachedAudio(state.id);

  const { fetchError, submitRequestQuery, requestQueryInputRef } = useWidgetDataFetcher({
    widget: state,
    dispatch,
    shouldFetchInitially: () => podcastQuery && !podcastFeedData,
    requestQuery: podcastQuery,
    setRequestQuery: (newPodcastQuery: typeof podcastQuery) => {
      dispatch({ type: 'setPodcastQuery', payload: newPodcastQuery });
    },
    getApiUrl: (query: typeof podcastQuery) => {
      return `widgets/Podcast/search-podcasts.php?q=${encodeURIComponent(query)}`;
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

  // Pause the audio in case it's still playing when the user removes the
  // widget from their dashboard
  useWidgetCleanupOnRemove(state, () => {
    audioElement.pause();
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
            podcastFeedData={podcastFeedData}
            nowPlaying={nowPlaying}
            dispatch={dispatch} />
        ) : null}
      </section>
    </WidgetShell>
  );

});

export default PodcastWidget;
