import React from 'react';
import { StateAction, WidgetContentsParameters } from '../../types.d';
import { PodcastWidgetState, PodcastDetails, PodcastListeningMetadataEntry } from './Podcast.d';
import WidgetShell from '../WidgetShell';
import useWidgetShell from '../useWidgetShell';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import PodcastNowPlaying from './PodcastNowPlaying';
import PodcastEpisodeList from './PodcastEpisodeList';

export function reducer(state: PodcastWidgetState, action: StateAction): PodcastWidgetState {
  switch (action.type) {
    case 'setPodcastDetails':
      const podcastDetails = action.payload as PodcastDetails;
      return { ...state, podcastDetails };
    case 'setPodcastUrl':
      const podcastUrl = action.payload as string;
      return {
        ...state,
        podcastUrl,
        podcastDetails: null,
        // Reset the transient metadata about the currently playing episode and
        // listening history whenever the podcast feed changes
        nowPlaying: state.podcastUrl !== podcastUrl ?
          null :
          state.nowPlaying || null,
        viewingNowPlaying: false,
        listeningMetadata: state.podcastUrl !== podcastUrl ?
          {} :
          state.listeningMetadata || {}
      };
    case 'setNowPlaying':
      const nowPlayingEpisodeGuid = action.payload as string;
      return {
        ...state,
        nowPlaying: state.podcastDetails.item.find((episode) => episode.guid === nowPlayingEpisodeGuid),
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
  const { podcastUrl, podcastDetails, nowPlaying, isPlaying, viewingNowPlaying, listeningMetadata } = state as PodcastWidgetState;
  const nowPlayingMetadata = nowPlaying ? listeningMetadata[nowPlaying.guid] : null;

  const { fetchError, submitRequestQuery, requestQueryInputRef } = useWidgetDataFetcher({
    widget: state,
    dispatch,
    shouldFetch: () => podcastUrl && !podcastDetails,
    requestQuery: podcastUrl,
    setRequestQuery: (newPodcastUrl: typeof podcastUrl) => {
      dispatch({ type: 'setPodcastUrl', payload: newPodcastUrl });
    },
    getApiUrl: (query: typeof podcastUrl) => {
      return `widgets/Podcast/api.php?podcast_url=${encodeURIComponent(query)}`;
    },
    parseResponse: (data: {channel: PodcastDetails}) => data.channel,
    hasResults: (data: typeof podcastDetails) => data.item && data.item.length,
    onSuccess: (data: typeof podcastDetails) => {
      dispatch({
        type: 'setPodcastDetails',
        payload: data
      });
    },
    getNoResultsMessage: (data: typeof podcastDetails) => 'No Podcasts Found',
    getErrorMessage: (error: Error) => 'Error Fetching Podcast'
  });

  return (
    <WidgetShell widget={state} dispatch={dispatch} provided={provided}>
      <section className="podcast">
        {widget.isSettingsOpen || !podcastUrl || !podcastDetails || fetchError ? (
          <form
            className="podcast-settings"
            onSubmit={(event) => submitRequestQuery((event))}>
            <h2 className="podcast-settings-heading">Podcast</h2>
            <input
            type="url"
            className="podcast-url"
            name="search"
            defaultValue={podcastUrl}
            placeholder="An Apple Podcast URL"
            required
            ref={requestQueryInputRef} />
            <button type="submit" className="podcast-url-submit">Submit</button>
            {fetchError ? (
              <p className="podcast-error">{fetchError}</p>
              ) : null}
          </form>
        ) : podcastUrl && podcastDetails && nowPlaying && viewingNowPlaying ? (
          <PodcastNowPlaying
            podcastDetails={podcastDetails}
            nowPlaying={nowPlaying}
            nowPlayingMetadata={nowPlayingMetadata}
            isPlaying={isPlaying}
            dispatch={dispatch} />
        ) : podcastUrl && podcastDetails && !viewingNowPlaying ? (
          <PodcastEpisodeList
            podcastDetails={podcastDetails}
            nowPlaying={nowPlaying}
            dispatch={dispatch} />
        ) : null}
      </section>
    </WidgetShell>
  );

}

export default PodcastWidget;
