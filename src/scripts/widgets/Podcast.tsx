import React, { useReducer, useRef, useEffect } from 'react';
import { WidgetDataState, StateAction, WidgetContentsParameters } from '../types.d';
import { PodcastDetails, PodcastEpisode } from './Podcast.d';
import { useWidgetUpdater } from '../hooks';
import LoadingIndicator from '../LoadingIndicator';

export function reducer(state: WidgetDataState, action: StateAction): WidgetDataState {
  switch (action.type) {
    case 'setPodcastDetails':
      return {
        ...state,
        podcastDetails: action.payload,
        isFetchingPodcast: false
      };
    case 'setPodcastUrl':
      return { ...state, podcastUrl: action.payload, podcastDetails: null };
    case 'showLoading':
      return { ...state, isFetchingPodcast: true };
    default:
      return state;
  }
}

function Podcast({ widget, widgetData, dispatchWidget }: WidgetContentsParameters) {

  const [state, dispatch] = useReducer(reducer, { ...widgetData, isFetchingPodcast: false });
  const { podcastUrl, podcastDetails, isFetchingPodcast } = state as {
    podcastUrl: string,
    podcastDetails: PodcastDetails,
    isFetchingPodcast: boolean
  };

  const podcastUrlInputRef: {current: HTMLInputElement} = useRef(null);

  // Fetch the podcast details through a proxy endpoint to eliminate any CORS
  // issues
  const API_URL = './widgets/Podcast/api.php';

  async function fetchPodcastDetails(podcastUrl: string): Promise<object> {
    dispatchWidget({ type: 'closeSettings' });
    dispatch({ type: 'showLoading' });
    const podcastResponse = await fetch(`${API_URL}?podcast_url=${encodeURIComponent(podcastUrl)}`);
    const podcastDetails = await podcastResponse.json();
    if (podcastDetails) {
      dispatch({
        type: 'setPodcastDetails',
        payload: podcastDetails.channel
      });
    } else {
      dispatch({ type: 'setPodcastDetails', payload: null });
    }
    return podcastDetails;
  }

  function submitPodcastUrl(event: React.FormEvent): void {
    event.preventDefault();
    const input = podcastUrlInputRef.current;
    if (input) {
      dispatch({ type: 'setPodcastUrl', payload: input.value });
    }
  }

  useEffect(() => {
    if (podcastUrl && !podcastDetails && !isFetchingPodcast) {
      fetchPodcastDetails(podcastUrl);
    }
  }, [podcastUrl, podcastDetails, isFetchingPodcast]);

    // Save updates to widget as changes are made
  useWidgetUpdater(widget, state);

  console.log('podcastDetails', podcastDetails);

  return (
    <section className="podcast">
      {((widget.isSettingsOpen || !podcastUrl || !podcastDetails) && !isFetchingPodcast) ? (
        <form
          className="podcast-settings"
          onSubmit={(event) => submitPodcastUrl((event))}>
          <h2 className="podcast-settings-heading">Podcast</h2>
          <input
          type="text"
          className="podcast-url"
          name="search"
          defaultValue={podcastUrl}
          placeholder="An Apple Podcast URL"
          required
          ref={podcastUrlInputRef} />
          <button className="podcast-url-submit">Submit</button>
        </form>
      ) : podcastUrl && isFetchingPodcast ? (
        <LoadingIndicator />
      ) : podcastUrl && podcastDetails ? (
        <div className="podcast-view">
          <h2 className="podcast-title">{podcastDetails.title}</h2>
          <ol className="podcast-episode-entries">
            {podcastDetails.item.map((episode: PodcastEpisode) => {
              return (
                <div className="podcast-episode-entry" key={episode.guid}>
                  <h3 className="podcast-episode-entry-title">{episode.title}</h3>
                </div>
              );
            })}
          </ol>
        </div>
      ) : null}
    </section>
  );

}

export default Podcast;
