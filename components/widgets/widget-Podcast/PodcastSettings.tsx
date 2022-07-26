import useUniqueFieldId from '../../useUniqueFieldId';
import useWidgetDataFetcher from '../useWidgetDataFetcher';
import { PodcastInfo } from './podcast.d';
import PodcastPodcastList from './PodcastPodcastList';

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
        <button type="submit" className="podcast-url-submit">
          Search
        </button>
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
