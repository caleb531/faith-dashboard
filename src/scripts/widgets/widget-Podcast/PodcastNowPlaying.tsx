import React, { Dispatch } from 'react';
import { StateAction, WidgetState } from '../../types.d';
import { PodcastFeedData, PodcastEpisode, PodcastListeningMetadataEntry } from './Podcast.d';
import PodcastAudioPlayer from './PodcastAudioPlayer';

function PodcastNowPlaying({ widget, podcastFeedData, podcastImage, nowPlaying, nowPlayingMetadata, isPlaying, dispatch }: { widget: WidgetState, podcastFeedData: PodcastFeedData, podcastImage: string, nowPlaying: PodcastEpisode, nowPlayingMetadata: PodcastListeningMetadataEntry, isPlaying: boolean, dispatch: Dispatch<StateAction> }) {

  function returnToEpisodeList() {
    dispatch({ type: 'setViewingNowPlaying', payload: false });
  }

  return (
    <div className="podcast-view-now-playing">
      <header className="podcast-now-playing-header">
        {podcastImage || podcastFeedData.image ? (
          <img
            className="podcast-now-playing-image"
            src={podcastImage || podcastFeedData.image.url}
            alt="" />
        ) : (
          <div className="podcast-now-playing-image podcast-now-playing-image-missing">?</div>
        )}
        <section className="podcast-now-playing-episode-info">
        <h2 className="podcast-now-playing-episode-title">{nowPlaying.title}</h2>
        </section>
      </header>
      <div className="podcast-now-playing-audio-player-container">
        <PodcastAudioPlayer
          audioElementKey={widget.id}
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
