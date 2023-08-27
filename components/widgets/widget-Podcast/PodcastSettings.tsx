import Button from '@components/reusable/Button';
import useUniqueFieldId from '../../useUniqueFieldId';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import PodcastPodcastList from './PodcastPodcastList';
import { PodcastInfo } from './podcast.types';

type Props = {
  podcastQuery: string;
  podcastFetcher: ReturnType<typeof useWidgetDataFetcher>;
  feedFetcher: ReturnType<typeof useWidgetDataFetcher>;
  podcastList: PodcastInfo[];
};

function PodcastSettings({
  podcastQuery,
  podcastFetcher,
  feedFetcher,
  podcastList
}: Props) {
  const searchFieldId = useUniqueFieldId('podcast-search');

  return (
    <div className="podcast-search">
      <form
        className="podcast-settings"
        onSubmit={(event) => podcastFetcher.submitRequestQuery(event)}
      >
        <h2 className="podcast-settings-heading">Podcast</h2>
        <label
          htmlFor={searchFieldId}
          className="podcast-search accessibility-only"
        >
          Podcast Search Query
        </label>
        <input
          type="search"
          id={searchFieldId}
          className="podcast-search"
          name="search"
          defaultValue={podcastQuery}
          placeholder="Search for podcasts"
          required
          ref={podcastFetcher.requestQueryInputRef}
        />
        <Button type="submit" className="podcast-url-submit">
          Search
        </Button>
        {podcastFetcher.fetchError ? (
          <p className="podcast-error">{podcastFetcher.fetchError}</p>
        ) : null}
      </form>
      <PodcastPodcastList
        podcastList={podcastList}
        fetchPodcastFeed={feedFetcher.fetchWidgetData}
      />
    </div>
  );
}

export default PodcastSettings;
