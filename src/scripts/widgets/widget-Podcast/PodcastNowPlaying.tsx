import React from 'react';
import { PodcastDetails, PodcastEpisode } from './Podcast.d';
import PodcastAudioPlayer from './PodcastAudioPlayer';

function PodcastNowPlaying({ podcastDetails, nowPlaying, isPlaying, dispatch }: { podcastDetails: PodcastDetails, nowPlaying: PodcastEpisode, isPlaying: boolean, dispatch: Function }) {

  function returnToEpisodeList() {
    dispatch({ type: 'setViewingNowPlaying', payload: false });
  }

  return (
    <div className="podcast-view-now-playing">
      <header className="podcast-now-playing-header">
          <img
            className="podcast-now-playing-image"
            src={podcastDetails.image.url}
            alt="" />
            <section className="podcast-now-playing-episode-info">
              <h2 className="podcast-now-playing-episode-title">{nowPlaying.title}</h2>
            </section>
      </header>
      <div className="podcast-now-playing-audio-player-container">
        <PodcastAudioPlayer
          nowPlaying={nowPlaying}
          isPlaying={isPlaying}
          dispatch={dispatch} />
      </div>
      <footer className="podcast-now-playing-footer">
        <button type="button" className="podcast-now-playing-return-to-list" onClick={returnToEpisodeList}>Return to List</button>
      </footer>
    </div>
  );

}

export default PodcastNowPlaying;
