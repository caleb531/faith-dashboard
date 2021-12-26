import { intervalToDuration } from 'date-fns';
import React from 'react';
import LoadingIndicator from '../../generic/LoadingIndicator';
import useUniqueFieldId from '../../useUniqueFieldId';
import useAudioLoader from './useAudioLoader';
import useAudioPlayPause from './useAudioPlayPause';
import useAudioSeeker from './useAudioSeeker';
import useAudioTime from './useAudioTime';
import useCachedAudio from './useCachedAudio';

type Props = { audioElementKey: string, audioUrl: string, currentTime: number, setCurrentTime: (newCurrentTime: number) => void, isPlaying: boolean, setIsPlaying: (newIsPlaying: boolean) => void };

function AudioPlayer({ audioElementKey, audioUrl, currentTime, setCurrentTime, isPlaying, setIsPlaying }: Props) {

  // Use a single (cached) audio element across all episodes (however, still
  // per Widget) so that:
  // 1) If a widget component is completely recreated (e.g. when the widget is
  //    drag-and-dropped to a new dashboard column), the audio playback is
  //    uninterrupted
  // 2) We eliminate any issues of multiple audio streams playing at the same
  //    time (at least within the same widget)
  const [audioElement] = useCachedAudio(audioElementKey);

  useAudioLoader(audioElement);
  useAudioPlayPause(audioElement, isPlaying, setIsPlaying);
  useAudioTime(audioElement, audioUrl, currentTime, setCurrentTime);
  const { seekerProvided } = useAudioSeeker(audioElement, currentTime, setCurrentTime);
  const seekerFieldId = useUniqueFieldId('audio-player-seeker-slider');

  // Zero-pad the given number if it's a single-digit; used for computing
  // hh:mm:ss timestamps in the below formatSecondsAsTimestamp() function
  function padWithZero(value: number): string {
    return (value < 10) ? `0${value}` : String(value);
  }

  // Format the given number of seconds
  function formatSecondsAsTimestamp(totalSeconds: number): string {
    const { hours, minutes, seconds } = intervalToDuration({
      start: 0,
      end: Math.floor(totalSeconds) * 1000
    });
    if (hours) {
      return [hours, padWithZero(minutes), padWithZero(seconds)].join(':');
    } else {
      return [minutes, padWithZero(seconds)].join(':');
    }
  }

  return (
    <div className="audio-player">
      <button className="audio-player-playpause" onClick={() => setIsPlaying(!isPlaying)} disabled={!audioElement.duration}>
        {!audioElement.duration ? (
          <LoadingIndicator />
        ) : isPlaying ? (
          <img
            className="audio-player-playpause-icon"
            src="icons/pause-light.svg"
            alt="Pause"
            draggable="false" />
        ) : (
          <img
            className="audio-player-playpause-icon"
            src="icons/play-light.svg"
            alt="Play"
            draggable="false" />
        )}
      </button>
      <div className="audio-player-seeker-container">
        <label htmlFor={seekerFieldId} className="search accessibility-only">
          Audio Progress
        </label>
        <input
          type="range"
          id={seekerFieldId}
          className="audio-player-seeker-slider"
          name="seeker"
          min="0"
          max={audioElement.duration || 0}
          step="1"
          disabled={!audioElement.duration}
          {...seekerProvided} />
        <div className="audio-player-time-info">
          <span className="audio-player-current-time">
            {!audioElement.duration ?
              'Loading...' :
              audioElement.currentTime >= 1 ?
              formatSecondsAsTimestamp(Math.floor(audioElement.currentTime)) :
              '0:00'
            }
          </span>
          <span className="audio-player-time-remaining">{audioElement.duration ?
            Math.round(audioElement.duration - audioElement.currentTime) > 0 ?
            `-${formatSecondsAsTimestamp(audioElement.duration - audioElement.currentTime)}`
            : '0:00'
           : null}</span>
        </div>
      </div>
    </div>
  );

}

export default AudioPlayer;
