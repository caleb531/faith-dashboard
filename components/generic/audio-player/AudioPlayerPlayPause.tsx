import React from 'react';
import LoadingIndicator from '../LoadingIndicator';
import useAudioPlayPause from './useAudioPlayPause';

type Props = { audioElement: HTMLAudioElement, isPlaying: boolean, setIsPlaying: (newIsPlaying: boolean) => void };

function AudioPlayerPlayPause({ audioElement, isPlaying, setIsPlaying }: Props) {

  function toggleAudioElementPlayback() {
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  useAudioPlayPause(audioElement, isPlaying, setIsPlaying);

  return (
    <button className="audio-player-playpause" onClick={() => toggleAudioElementPlayback()} disabled={!audioElement.duration}>
      {!audioElement.duration ? (
        <LoadingIndicator />
      ) : (audioElement.paused) ? (
        <img
          className="audio-player-playpause-icon"
          src="icons/play-light.svg"
          alt="Play"
          draggable="false" />
      ) : (
        <img
          className="audio-player-playpause-icon"
          src="icons/pause-light.svg"
          alt="Pause"
          draggable="false" />
      )}
    </button>
  );

}

export default AudioPlayerPlayPause;
