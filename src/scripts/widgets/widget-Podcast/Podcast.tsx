import React from 'react';
import moment from 'moment';
import { StateAction, WidgetContentsParameters } from '../../types.d';
import { PodcastWidgetState, PodcastDetails, PodcastEpisode } from './Podcast.d';
import WidgetShell from '../WidgetShell';
import useWidgetShell from '../useWidgetShell';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import PodcastPlayer from './PodcastPlayer';

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
          state.nowPlaying,
        viewingNowPlaying: false,
        listeningHistory: state.podcastUrl !== podcastUrl ?
          {} :
          state.listeningHistory
      };
    case 'setNowPlaying':
      const nowPlayingEpisodeGuid = action.payload as string;
      return {
        ...state,
        nowPlaying: state.podcastDetails.item.find((episode) => episode.guid === nowPlayingEpisodeGuid),
        isPlaying: true
      };
    case 'setIsPlaying':
      const isPlaying = action.payload as boolean;
      return { ...state, isPlaying };
    default:
      throw new ReferenceError(`action ${action.type} does not exist on reducer`);
  }
}

function PodcastWidget({ widget, provided }: WidgetContentsParameters) {

  const [state, dispatch] = useWidgetShell(reducer, widget);
  const { podcastUrl, podcastDetails, nowPlaying, isPlaying } = state as PodcastWidgetState;

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

  // Use event delegation to determine which episode entry was clicked
  function clickEpisode(event: React.MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const episodeElem = clickedElement.closest('.podcast-episode-entry');
    const episodeGuid = episodeElem.getAttribute('data-episode-guid');
    dispatch({ type: 'setNowPlaying', payload: episodeGuid });
  }

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
            <button className="podcast-url-submit">Submit</button>
            {fetchError ? (
              <p className="podcast-error">{fetchError}</p>
              ) : null}
          </form>
        ) : podcastUrl && podcastDetails ? (
          <div className="podcast-view">
            <h2 className="podcast-title">{podcastDetails.title}</h2>
            <span className="podcast-episode-count">{podcastDetails.item.length === 1 ? `${podcastDetails.item.length} episode` : `${podcastDetails.item.length} episodes`}</span>
            {nowPlaying ? (
              <PodcastPlayer
              nowPlaying={nowPlaying}
              isPlaying={isPlaying}
              dispatch={dispatch}
              />
            ) : null}
            <ol className="podcast-episode-entries" onClick={clickEpisode}>
              {podcastDetails.item.map((episode: PodcastEpisode) => {
                return (
                  <li className="podcast-episode-entry" key={episode.guid} data-episode-guid={episode.guid}>
                    <h3 className="podcast-episode-entry-title">{episode.title}</h3>
                    <span className="podcast-episode-entry-date">{moment(episode.pubDate).fromNow()}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}
      </section>
    </WidgetShell>
  );

}

export default PodcastWidget;