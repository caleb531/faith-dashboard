import React from 'react';
import moment from 'moment';
import { PodcastDetails, PodcastEpisode } from './Podcast.d';

function PodcastEpisodes({ podcastDetails, nowPlaying, dispatch }: { podcastDetails: PodcastDetails, nowPlaying: PodcastEpisode, dispatch: Function }) {

  // Use event delegation to determine which episode entry was clicked
  function clickEpisode(event: React.MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const episodeElem = clickedElement.closest('.podcast-episode-entry');
    const episodeGuid = episodeElem.getAttribute('data-episode-guid');
    dispatch({ type: 'setNowPlaying', payload: episodeGuid });
  }

  function viewNowPlaying() {
    dispatch({ type: 'setViewingNowPlaying', payload: true });
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
      <ol className="podcast-episode-entries" onClick={clickEpisode}>
        {podcastDetails.item.map((episode: PodcastEpisode) => {
          return (
            <li className="podcast-episode-entry" key={episode.guid} data-episode-guid={episode.guid}>
              <h3 className="podcast-episode-entry-title">{episode.title}</h3>
              <span className="podcast-episode-entry-date">{moment(episode.pubDate).fromNow()}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );

}

export default PodcastEpisodes;
