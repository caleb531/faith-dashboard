import { useContext } from 'react';
import LoadingIndicator from '../LoadingIndicator';
import AudioPlayerContext from './AudioPlayerContext';
import useAudioPlayPause from './useAudioPlayPause';

type Props = {
  isDisabled: boolean;
  isLoading: boolean;
};

function AudioPlayerPlayPause({ isDisabled, isLoading }: Props) {
  const { audioElement, isPlaying, setIsPlaying } =
    useContext(AudioPlayerContext);

  function toggleAudioElementPlayback() {
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  useAudioPlayPause(audioElement, isPlaying, setIsPlaying);

  return (
    <button
      type="button"
      className="audio-player-control audio-player-playpause"
      onClick={() => toggleAudioElementPlayback()}
      disabled={isDisabled}
    >
      {isDisabled || isLoading ? (
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
