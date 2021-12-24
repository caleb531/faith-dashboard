import React, { Dispatch } from 'react';
import ResultList from '../../generic/ResultList';
import { Result } from '../../generic/resultList.d';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import { WidgetAction } from '../useWidgetShell';
import { WidgetState } from '../widget.d';
import { PodcastFeedData, PodcastInfo, PodcastWidgetState } from './podcast.d';
import { PodcastAction } from './PodcastReducer';

type Props = { widget: WidgetState, podcastList: PodcastInfo[], dispatch: Dispatch<PodcastAction | WidgetAction> };

function PodcastPodcastList({ widget, podcastList, dispatch }: Props) {

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
      return `widgets/podcast/feed?url=${encodeURIComponent(feedUrl)}`;
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
    const data = result.data as { feedUrl: string, image: string };
    dispatch({ type: 'setPodcastFeedUrl', payload: data.feedUrl });
    dispatch({ type: 'setPodcastImage', payload: data.image });
    fetchWidgetData(data.feedUrl);
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
          feedUrl: podcast.feedUrl,
          image: podcast.artworkUrl100
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
