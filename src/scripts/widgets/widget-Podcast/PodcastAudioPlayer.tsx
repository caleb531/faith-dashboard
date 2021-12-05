import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import 'moment-duration-format';
import { PodcastEpisode, PodcastListeningMetadataEntry } from './Podcast.d';
import LoadingIndicator from '../../generic/LoadingIndicator';
import useCachedAudio from './useCachedAudio';
import useAudioLoader from './useAudioLoader';
import useAudioTime from './useAudioTime';
import useAudioPlayPause from './useAudioPlayPause';
import useAudioSeeker from './useAudioSeeker';

function PodcastAudioPlayer({ nowPlaying, nowPlayingMetadata, isPlaying, dispatch }: { nowPlaying: PodcastEpisode, nowPlayingMetadata: PodcastListeningMetadataEntry, isPlaying: boolean, dispatch: Function }) {

  const audioUrl = nowPlaying.enclosure['@attributes'].url;
  const currentTime = nowPlayingMetadata ? nowPlayingMetadata.currentTime : 0;

  // Use a single (cached) audio element across all episodes (and even across
  // all podcast instances) so that:
  // 1) If the widget component is completely recreated (e.g. when the widget
  //    is drag-and-dropped to a new dashboard column), the audio playback is
  //    uninterrupted
  // 2) We eliminate any issues of multiple audio streams playing at the same
  //    time
  const audioElement = useCachedAudio();

  useAudioLoader(audioElement);

  // Control the play/pause state of the podcast widget when the appropriate
  // player controls are clicked
  function setIsPlaying(newIsPlaying: boolean): void {
    dispatch({ type: 'setIsPlaying', payload: newIsPlaying });
  }
  useAudioPlayPause(audioElement, isPlaying, setIsPlaying);

  const { setCurrentTime } = useAudioTime(audioElement, audioUrl, isPlaying, currentTime, () => {
    dispatch({
      type: 'updateNowPlayingMetadata',
      payload: { currentTime: audioElement.currentTime }
    });
  });

  const { seekerProvided } = useAudioSeeker(audioElement, currentTime);

  return (
    <div className="podcast-audio-player">
      <button className="podcast-audio-player-playpause" onClick={() => setIsPlaying(!isPlaying)} disabled={!audioElement.duration}>
        {!audioElement.duration ? (
          <LoadingIndicator />
        ) : isPlaying ? (
          <img
            className="podcast-audio-player-playpause-icon"
            src="icons/pause-light.svg"
            alt="Pause"
            draggable="false" />
        ) : (
          <img
            className="podcast-audio-player-playpause-icon"
            src="icons/play-light.svg"
            alt="Play"
            draggable="false" />
        )}
      </button>
      <div className="podcast-audio-player-seeker-container">
        <input
          type="range"
          className="podcast-audio-player-seeker-slider"
          name="seeker"
          min="0"
          max={audioElement.duration || 0}
          step="1"
          {...seekerProvided}
          onMouseUp={setCurrentTime} />
        <div className="podcast-audio-player-time-info">
          <span className="podcast-audio-player-current-time">
            {!audioElement.duration ?
              'Loading...' :
              audioElement.currentTime >= 1 ?
              moment.duration(Math.floor(audioElement.currentTime), 'seconds').format() :
              '0:00'
            }
          </span>
          <span className="podcast-audio-player-time-remaining">{audioElement.duration ?
            Math.round(audioElement.duration - audioElement.currentTime) > 0 ?
            `-${moment.duration(audioElement.duration - audioElement.currentTime, 'seconds').format()}`
            : '0:00'
           : null}</span>
        </div>
      </div>
    </div>
  );

}

export default PodcastAudioPlayer;
