import LoadingIndicator from '../LoadingIndicator';
import useAudioPlayPause from './useAudioPlayPause';

type Props = {
  audioElement: HTMLAudioElement;
  audioUrl: string;
  isPlaying: boolean;
  setIsPlaying: (newIsPlaying: boolean) => void;
  isDisabled: boolean;
  isLoading: boolean;
};

function AudioPlayerPlayPause({
  audioElement,
  audioUrl,
  isPlaying,
  setIsPlaying,
  isDisabled,
  isLoading
}: Props) {
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
