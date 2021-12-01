import React, { useReducer, useRef, useEffect } from 'react';
import moment from 'moment';
import { WidgetDataState, StateAction, WidgetContentsParameters } from '../types.d';
import { PodcastDetails, PodcastEpisode } from './Widget.Podcast.d';
import { useWidgetUpdater, useWidgetContentFetcher } from '../hooks';
import LoadingIndicator from '../generic/LoadingIndicator';

export function reducer(state: WidgetDataState, action: StateAction): WidgetDataState {
  switch (action.type) {
    case 'setPodcastDetails':
      return {
        ...state,
        podcastDetails: action.payload,
        isFetchingPodcast: false,
        fetchError: null
      };
    case 'setPodcastUrl':
      return {
        ...state,
        podcastUrl: action.payload,
        podcastDetails: null,
        fetchError: null
      };
    case 'showLoading':
      return { ...state, isFetchingPodcast: true, fetchError: null };
    case 'setFetchError':
      return { ...state, fetchError: action.payload, isFetchingPodcast: false };
    default:
      throw new ReferenceError(`action ${action.type} does not exist on reducer`);
  }
}

function Podcast({ widget, widgetData, dispatchWidget }: WidgetContentsParameters) {

  const [state, dispatch] = useReducer(reducer, {
    ...widgetData,
    isFetchingPodcast: false,
    podcastDetails: widgetData.podcastDetails || undefined
  });
  const { podcastUrl, podcastDetails, isFetchingPodcast, fetchError } = state as {
    podcastUrl: string,
    podcastDetails: PodcastDetails,
    isFetchingPodcast: boolean,
    fetchError: string
  };

  const podcastUrlInputRef: {current: HTMLInputElement} = useRef(null);

  function submitPodcastUrl(event: React.FormEvent): void {
    event.preventDefault();
    const input = podcastUrlInputRef.current;
    if (input) {
      dispatch({ type: 'setPodcastUrl', payload: input.value });
    }
  }

  useEffect(() => {
    console.log('podcastDetails', podcastDetails);
  }, [podcastDetails]);

    // Save updates to widget as changes are made
  useWidgetUpdater(widget, state);

  useWidgetContentFetcher({
    shouldFetch: () => {
      return podcastUrl && !podcastDetails && !isFetchingPodcast && !fetchError;
    },
    requestData: podcastUrl,
    closeSettings: () => dispatchWidget({ type: 'closeSettings' }),
    showLoading: () => dispatch({ type: 'showLoading' }),
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
    onNoResults: (data: typeof podcastDetails) => {
      dispatch({ type: 'setFetchError', payload: 'No Results Found' });
    },
    onError: (error: Error) => {
      dispatch({ type: 'setFetchError', payload: 'Error Fetching Podcast' });
    }
  }, [podcastUrl, podcastDetails, isFetchingPodcast, fetchError]);

  return (
    <section className="podcast">
      {((widget.isSettingsOpen || !podcastUrl || !podcastDetails || fetchError) && !isFetchingPodcast) ? (
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
      ) : podcastUrl && isFetchingPodcast ? (
        <LoadingIndicator />
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
  );

}

export default Podcast;
