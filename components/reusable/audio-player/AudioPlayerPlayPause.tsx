import { useContext, useState } from 'react';
import useEventListener from '../../useEventListener';
import LoadingIndicator from '../LoadingIndicator';
import AudioPlayerContext from './AudioPlayerContext';
import useAudioPlayPause from './useAudioPlayPause';

type Props = {
  isDisabled: boolean;
};

function AudioPlayerPlayPause({ isDisabled }: Props) {
  const { audioElement, isPlaying, setIsPlaying } =
    useContext(AudioPlayerContext);
  useAudioPlayPause(audioElement, isPlaying, setIsPlaying);
  const [isBufferingAfterSeek, setIsBufferingAfterSeek] = useState(false);

  useEventListener(audioElement, 'waiting', () => {
    setIsBufferingAfterSeek(true);
  });
  useEventListener(audioElement, 'playing', () => {
    setIsBufferingAfterSeek(false);
  });

  function toggleAudioElementPlayback() {
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  return (
    <button
      type="button"
      className="audio-player-control audio-player-playpause"
      onClick={() => toggleAudioElementPlayback()}
      disabled={isDisabled}
    >
      {isDisabled || isBufferingAfterSeek ? (
        <LoadingIndicator />
      ) : audioElement.paused ? (
        <img
          className="audio-player-playpause-icon"
          src="/icons/play-light.svg"
          alt="Play"
          draggable="false"
        />
      ) : (
        <img
          className="audio-player-playpause-icon"
          src="/icons/pause-light.svg"
          alt="Pause"
          draggable="false"
        />
      )}
    </button>
  );
}

export default AudioPlayerPlayPause;
