import React, { useReducer, useRef, useEffect } from 'react';
import moment from 'moment';
import { StateAction, WidgetContentsParameters } from '../types.d';
import { PodcastWidgetState, PodcastDetails, PodcastEpisode } from './Widget.Podcast.d';
import WidgetShell, { useWidgetShell } from './WidgetShell';
import { useWidgetDataFetcher } from '../hooks';

export function reducer(state: PodcastWidgetState, action: StateAction): PodcastWidgetState {
  switch (action.type) {
    case 'setPodcastDetails':
      const podcastDetails = action.payload as PodcastDetails;
      return { ...state, podcastDetails };
    case 'setPodcastUrl':
      const podcastUrl = action.payload as string;
      return { ...state, podcastUrl, podcastDetails: null, fetchError: null };
    default:
      throw new ReferenceError(`action ${action.type} does not exist on reducer`);
  }
}

function Podcast({ widget, provided }: WidgetContentsParameters) {

  const [state, dispatch] = useWidgetShell(reducer, widget);
  const { podcastUrl, podcastDetails } = state as PodcastWidgetState;

  const podcastUrlInputRef: {current: HTMLInputElement} = useRef(null);

  function submitPodcastUrl(event: React.FormEvent): void {
    event.preventDefault();
    const input = podcastUrlInputRef.current;
    if (input) {
      dispatch({ type: 'setPodcastUrl', payload: input.value });
    }
  }

  const { fetchError } = useWidgetDataFetcher({
    widget: state,
    dispatch,
    shouldFetch: () => {
      return podcastUrl && !podcastDetails;
    },
    requestData: podcastUrl,
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
  }, [podcastUrl, podcastDetails]);

  return (
    <WidgetShell widget={state} dispatch={dispatch} provided={provided}>
      <section className="podcast">
        {widget.isSettingsOpen || !podcastUrl || !podcastDetails || fetchError ? (
          <form
            className="podcast-settings"
            onSubmit={(event) => submitPodcastUrl((event))}>
            <h2 className="podcast-settings-heading">Podcast</h2>
            <input
            type="url"
            className="podcast-url"
            name="search"
            defaultValue={podcastUrl}
            placeholder="An Apple Podcast URL"
            required
            ref={podcastUrlInputRef} />
            <button className="podcast-url-submit">Submit</button>
            {fetchError ? (
              <p className="podcast-error">{fetchError}</p>
              ) : null}
          </form>
        ) : podcastUrl && podcastDetails ? (
          <div className="podcast-view">
            <h2 className="podcast-title">{podcastDetails.title}</h2>
            <span className="podcast-episode-count">{podcastDetails.item.length === 1 ? `${podcastDetails.item.length} episode` : `${podcastDetails.item.length} episodes`}</span>
            <ol className="podcast-episode-entries">
              {podcastDetails.item.map((episode: PodcastEpisode) => {
                return (
                  <li className="podcast-episode-entry" key={episode.guid}>
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

export default Podcast;
