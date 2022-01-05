import React, { Dispatch } from 'react';
import ResultList from '../../generic/ResultList';
import { Result } from '../../generic/resultList.d';
import { WidgetAction } from '../useWidgetShell';
import { WidgetState } from '../widget.d';
import { PodcastInfo, PodcastWidgetState } from './podcast.d';
import { PodcastAction } from './PodcastReducer';

type Props = {
  widget: WidgetState,
  podcastList: PodcastInfo[],
  fetchPodcastFeed: (query: string) => Promise<void>,
  dispatch: Dispatch<PodcastAction | WidgetAction> };

function PodcastPodcastList({ widget, podcastList, fetchPodcastFeed, dispatch }: Props) {

  const { podcastFeedUrl, podcastFeedData } = widget as PodcastWidgetState;

  function choosePodcast(result: Result) {
    const data = result.data as { feedUrl: string, image: string };
    dispatch({ type: 'setPodcastFeedUrl', payload: data.feedUrl });
    dispatch({ type: 'setPodcastImage', payload: data.image });
    fetchPodcastFeed(data.feedUrl);
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
