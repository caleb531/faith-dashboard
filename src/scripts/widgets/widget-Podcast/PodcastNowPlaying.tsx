import React from 'react';
import { PodcastFeedData, PodcastEpisode, PodcastListeningMetadataEntry } from './Podcast.d';
import PodcastAudioPlayer from './PodcastAudioPlayer';

function PodcastNowPlaying({ podcastFeedData, nowPlaying, nowPlayingMetadata, isPlaying, dispatch }: { podcastFeedData: PodcastFeedData, nowPlaying: PodcastEpisode, nowPlayingMetadata: PodcastListeningMetadataEntry, isPlaying: boolean, dispatch: Function }) {

  function returnToEpisodeList() {
    dispatch({ type: 'setViewingNowPlaying', payload: false });
  }

  return (
    <div className="podcast-view-now-playing">
      <header className="podcast-now-playing-header">
          <img
            className="podcast-now-playing-image"
            src={podcastFeedData.image.url}
            alt="" />
            <section className="podcast-now-playing-episode-info">
              <h2 className="podcast-now-playing-episode-title">{nowPlaying.title}</h2>
            </section>
      </header>
      <div className="podcast-now-playing-audio-player-container">
        <PodcastAudioPlayer
          nowPlaying={nowPlaying}
          nowPlayingMetadata={nowPlayingMetadata}
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
