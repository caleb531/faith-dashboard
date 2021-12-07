import React, { useState } from 'react';
import { StateAction, WidgetContentsParameters } from '../../types.d';
import { PodcastWidgetState, PodcastFeedData, PodcastListeningMetadataEntry, PodcastSearchResponse, PodcastInfo } from './Podcast.d';
import WidgetShell from '../WidgetShell';
import useWidgetShell from '../useWidgetShell';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import useCachedState from '../../useCachedState';
import PodcastPodcastList from './PodcastPodcastList';
import PodcastNowPlaying from './PodcastNowPlaying';
import PodcastEpisodeList from './PodcastEpisodeList';

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

function PodcastWidget({ widget, provided }: WidgetContentsParameters) {

  const [state, dispatch] = useWidgetShell(reducer, widget);
  const {
    podcastQuery,
    podcastFeedUrl,
    podcastFeedData,
    nowPlaying,
    isPlaying,
    viewingNowPlaying,
    listeningMetadata
  } = state as PodcastWidgetState;
  const nowPlayingMetadata = nowPlaying ? listeningMetadata[nowPlaying.guid] : null;
  const [podcastList, setPodcastList] = useCachedState<PodcastInfo[]>(`podcast-list-for-widget-${widget.id}`, () => {
    return [];
  });

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
      setPodcastList(results);
    },
    getNoResultsMessage: (results: typeof podcastFeedData) => 'No Podcasts Found',
    getErrorMessage: (error: Error) => 'Error Searching for Podcasts'
  });

  return (
    <WidgetShell widget={state} dispatch={dispatch} provided={provided}>
      <section className="podcast">
        {widget.isSettingsOpen || !podcastFeedUrl || !podcastFeedData || fetchError ? (
          <div className="podcast-search">
            <form
              className="podcast-settings"
              onSubmit={(event) => submitRequestQuery((event))}>
              <h2 className="podcast-settings-heading">Podcast</h2>
              <input
              type="search"
              className="podcast-query"
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
            podcastFeedData={podcastFeedData}
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

}

export default PodcastWidget;
