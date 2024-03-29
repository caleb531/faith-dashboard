import Button from '@components/reusable/Button';
import Icon from '@components/reusable/Icon';
import { formatDistanceToNow } from 'date-fns';
import { useContext } from 'react';
import ResultList from '../../reusable/ResultList';
import { Result } from '../../reusable/resultList.types';
import PodcastContext from './PodcastContext';
import { PodcastEpisode, PodcastWidgetState } from './podcast.types';

type Props = {
  widget: PodcastWidgetState;
  nowPlaying?: PodcastEpisode | null;
  fetchPodcastFeed: (url: string) => Promise<void>;
};

function PodcastEpisodeList({
  widget: { podcastFeedUrl, podcastFeedData },
  nowPlaying,
  fetchPodcastFeed
}: Props) {
  const dispatchToWidget = useContext(PodcastContext);

  // Use event delegation to determine which episode entry was clicked
  function chooseEpisode(result: Result) {
    dispatchToWidget({ type: 'setNowPlaying', payload: result.id });
  }

  function viewNowPlaying() {
    dispatchToWidget({ type: 'setViewingNowPlaying', payload: true });
  }

  // Convert the current episode list to a proper ResultList structure
  function getEpisodeResultList(): Result[] {
    return (
      // podcastFeedData is guaranteed to exist thanks to the condition in the
      // Podcast component (around line 178)
      podcastFeedData!.item.map((episode: PodcastEpisode) => {
        return {
          id: episode.guid,
          title: episode.title,
          subtitle: episode.pubDate
            ? formatDistanceToNow(new Date(episode.pubDate), {
                addSuffix: true
              })
            : null
        };
      })
    );
  }

  return (
    <section className="podcast-view-episodes">
      <h2 className="podcast-title">{podcastFeedData?.title}</h2>
      {nowPlaying ? (
        <Button className="podcast-now-playing-link" onClick={viewNowPlaying}>
          Now Playing
        </Button>
      ) : null}
      <div className="podcast-subtext">
        <span className="podcast-episode-count">
          {podcastFeedData?.item.length === 1
            ? `${podcastFeedData.item.length} episode`
            : `${podcastFeedData?.item.length} episodes`}
        </span>
        <Button
          className="podcast-episodes-refresh-control widget-control"
          onClick={() => fetchPodcastFeed(podcastFeedUrl!)}
        >
          <Icon name="refresh-light" alt="Check for New Episodes" />
        </Button>
      </div>
      <ResultList
        results={getEpisodeResultList()}
        onChooseResult={chooseEpisode}
      />
    </section>
  );
}

export default PodcastEpisodeList;
