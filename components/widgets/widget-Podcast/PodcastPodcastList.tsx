import { useContext } from 'react';
import ResultList from '../../reusable/ResultList';
import { Result } from '../../reusable/resultList.types';
import PodcastContext from './PodcastContext';
import { PodcastInfo } from './podcast.types';

type Props = {
  podcastList: PodcastInfo[];
  fetchPodcastFeed: (url: string) => Promise<void>;
};

function PodcastPodcastList({ podcastList, fetchPodcastFeed }: Props) {
  const dispatchToWidget = useContext(PodcastContext);

  function choosePodcast(result: Result) {
    const data = result.data as { feedUrl: string; image: string };
    dispatchToWidget({ type: 'setPodcastFeedUrl', payload: data.feedUrl });
    dispatchToWidget({ type: 'setPodcastImage', payload: data.image });
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
        <div className="podcast-podcast-count">
          {podcastList.length === 1
            ? `${podcastList.length} podcast`
            : `${podcastList.length} podcasts`}
        </div>
      ) : null}
      <ResultList
        results={getPodcastResultList()}
        onChooseResult={choosePodcast}
      />
    </div>
  );
}

export default PodcastPodcastList;
