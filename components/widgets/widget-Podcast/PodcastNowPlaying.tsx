import React, { Dispatch, useCallback } from 'react';
import AudioPlayer from '../../generic/audio-player/AudioPlayer';
import { WidgetAction } from '../useWidgetShell';
import { WidgetState } from '../widget.d';
import { PodcastEpisode, PodcastFeedData, PodcastListeningMetadataEntry } from './podcast.d';
import { PodcastAction } from './PodcastReducer';

type Props = { widget: WidgetState, podcastFeedData: PodcastFeedData, podcastImage: string, nowPlaying: PodcastEpisode, nowPlayingMetadata: PodcastListeningMetadataEntry, isPlaying: boolean, dispatch: Dispatch<PodcastAction | WidgetAction> };

function PodcastNowPlaying({ widget, podcastFeedData, podcastImage, nowPlaying, nowPlayingMetadata, isPlaying, dispatch }: Props) {

  const audioUrl = nowPlaying.enclosure.url;
  const currentTime = nowPlayingMetadata ? nowPlayingMetadata.currentTime : 0;

  const setCurrentTime = useCallback((newCurrentTime: number) => {
    dispatch({
      type: 'updateNowPlayingMetadata',
      payload: { currentTime: newCurrentTime }
    });
  }, [dispatch]);

  // Control the play/pause state of the podcast widget when the appropriate
  // player controls are clicked
  const setIsPlaying = useCallback((newIsPlaying: boolean) => {
    dispatch({ type: 'setIsPlaying', payload: newIsPlaying });
  }, [dispatch]);

  function returnToEpisodeList() {
    dispatch({ type: 'setViewingNowPlaying', payload: false });
  }

  return (
    <section className="podcast-view-now-playing">
      <header className="podcast-now-playing-header">
        {podcastImage || podcastFeedData['itunes:image'] ? (
          <img
            className="podcast-now-playing-image"
            src={podcastImage || podcastFeedData['itunes:image'].href}
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
    </section>
  );

}

export default PodcastNowPlaying;
