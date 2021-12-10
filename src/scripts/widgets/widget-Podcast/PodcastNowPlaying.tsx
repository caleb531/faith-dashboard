import React, { Dispatch } from 'react';
import { StateAction, WidgetState } from '../../types.d';
import { PodcastFeedData, PodcastEpisode, PodcastListeningMetadataEntry } from './Podcast.d';
import AudioPlayer from '../../generic/audio-player/AudioPlayer';

type Props = { widget: WidgetState, podcastFeedData: PodcastFeedData, podcastImage: string, nowPlaying: PodcastEpisode, nowPlayingMetadata: PodcastListeningMetadataEntry, isPlaying: boolean, dispatch: Dispatch<StateAction> };

function PodcastNowPlaying({ widget, podcastFeedData, podcastImage, nowPlaying, nowPlayingMetadata, isPlaying, dispatch }: Props) {

  const audioUrl = nowPlaying.enclosure['@attributes'].url;
  const currentTime = nowPlayingMetadata ? nowPlayingMetadata.currentTime : 0;

  function setCurrentTime(newCurrentTime: number): void {
    dispatch({
      type: 'updateNowPlayingMetadata',
      payload: { currentTime: newCurrentTime }
    });
  }

  // Control the play/pause state of the podcast widget when the appropriate
  // player controls are clicked
  function setIsPlaying(newIsPlaying: boolean): void {
    dispatch({ type: 'setIsPlaying', payload: newIsPlaying });
  }

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
        <AudioPlayer
          audioElementKey={widget.id}
          audioUrl={audioUrl}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying} />
      </div>
      <footer className="podcast-now-playing-footer">
        <button type="button" className="podcast-now-playing-return-to-list" onClick={returnToEpisodeList}>Return to List</button>
      </footer>
    </div>
  );

}

export default PodcastNowPlaying;
