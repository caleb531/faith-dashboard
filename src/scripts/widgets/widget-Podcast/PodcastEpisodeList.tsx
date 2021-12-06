import React from 'react';
import moment from 'moment';
import { PodcastDetails, PodcastEpisode } from './Podcast.d';
import { Result } from '../../types.d';
import ResultList from '../../generic/ResultList';

function PodcastEpisodeList({ podcastDetails, nowPlaying, dispatch }: { podcastDetails: PodcastDetails, nowPlaying: PodcastEpisode, dispatch: Function }) {

  // Use event delegation to determine which episode entry was clicked
  function chooseEpisode(result: Result) {
    dispatch({ type: 'setNowPlaying', payload: result.id });
  }

  function viewNowPlaying() {
    dispatch({ type: 'setViewingNowPlaying', payload: true });
  }

  // Convert the current podcast's episodes to a result list structure
  function getEpisodeResultList(): Result[] {
    return podcastDetails.item.map((episode: PodcastEpisode) => {
      return {
        id: episode.guid,
        title: episode.title,
        subtitle: moment(episode.pubDate).fromNow()
      };
    });
  }

  return (
    <section className="podcast-view-episodes">
      <h2 className="podcast-title">{podcastDetails.title}</h2>
      <div className="podcast-subtext">
        {nowPlaying ? (
          <button type="button" className="podcast-now-playing-link" onClick={viewNowPlaying}>Now Playing</button>
        ) : null}
        <div className="podcast-episode-count">{podcastDetails.item.length === 1 ? `${podcastDetails.item.length} episode` : `${podcastDetails.item.length} episodes`}</div>
      </div>
      <ResultList
        results={getEpisodeResultList()}
        onChooseResult={chooseEpisode} />
    </section>
  );

}

export default PodcastEpisodeList;
