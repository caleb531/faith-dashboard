import React, { Dispatch } from 'react';
import { PodcastWidgetState, PodcastInfo, PodcastFeedData } from './Podcast.d';
import { StateAction, WidgetState, Result } from '../../types.d';
import ResultList from '../../generic/ResultList';
import useWidgetDataFetcher from '../useWidgetDataFetcher';

function PodcastPodcastList({ widget, podcastList, dispatch }: { widget: WidgetState, podcastList: PodcastInfo[], dispatch: Dispatch<StateAction> }) {

  const { podcastFeedUrl, podcastFeedData } = widget as PodcastWidgetState;

  const { fetchError, fetchWidgetData } = useWidgetDataFetcher({
    widget,
    dispatch,
    shouldFetchInitially: () => podcastFeedUrl && !podcastFeedData,
    requestQuery: podcastFeedUrl,
    setRequestQuery: (newPodcastFeedUrl: typeof podcastFeedUrl) => {
      dispatch({ type: 'setPodcastFeedUrl', payload: newPodcastFeedUrl });
    },
    getApiUrl: (feedUrl: typeof podcastFeedUrl) => {
      return `widgets/Podcast/get-podcast.php?feed_url=${encodeURIComponent(feedUrl)}`;
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

  function choosePodcast(result: Result) {
    dispatch({ type: 'setPodcastFeedUrl', payload: result.data.feedUrl });
    fetchWidgetData(result.data.feedUrl);
  }

  // Convert the current podcast search results list to a proper ResultList
  // structure
  function getPodcastResultList(): Result[] {
    return podcastList.map((podcast: PodcastInfo) => {
      return {
        id: String(podcast.trackId),
        title: podcast.trackName,
        subtitle: podcast.artistName,
        data: {
          feedUrl: podcast.feedUrl
        }
      };
    });
  }

  return (
    <div className="podcast-result-list-container">
        {podcastList && podcastList.length ? (
          <div className="podcast-podcast-count">{podcastList.length === 1 ? `${podcastList.length} podcast` : `${podcastList.length} podcasts`}</div>
        ) : null}
      <ResultList
        results={getPodcastResultList()}
        onChooseResult={choosePodcast} />
    </div>
  );

}

export default PodcastPodcastList;
