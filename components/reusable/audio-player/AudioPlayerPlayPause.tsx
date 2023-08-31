import { useContext, useState } from 'react';
import useEventListener from '../../useEventListener';
import Button from '../Button';
import Icon from '../Icon';
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
    <Button
      className="audio-player-control audio-player-playpause"
      onClick={() => toggleAudioElementPlayback()}
      disabled={isDisabled}
    >
      {isDisabled || isBufferingAfterSeek ? (
        <LoadingIndicator />
      ) : audioElement.paused ? (
        <Icon name="play-light" alt="Play" />
      ) : (
        <Icon name="pause-light" alt="Pause" />
      )}
    </Button>
  );
}

export default AudioPlayerPlayPause;
