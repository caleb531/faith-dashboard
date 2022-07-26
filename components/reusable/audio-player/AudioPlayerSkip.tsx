import { useContext } from 'react';
import AudioPlayerContext from './AudioPlayerContext';

type Props = {
  action: 'skip-back' | 'skip-forward';
  skipOffset: 10 | 30;
  label: string;
  isDisabled: boolean;
};

function AudioPlayerSeeker({ action, skipOffset, label, isDisabled }: Props) {
  const { audioElement, setCurrentTime } = useContext(AudioPlayerContext);

  function adjustTime() {
    if (action === 'skip-forward') {
      audioElement.currentTime += skipOffset;
    } else {
      audioElement.currentTime -= skipOffset;
    }
    setCurrentTime(audioElement.currentTime);
  }

  return (
    <button
      className={`audio-player-control audio-player-${action}`}
      onClick={() => adjustTime()}
      disabled={isDisabled}
    >
      <img
        className={`audio-player-${action}-icon`}
        src={`/icons/${action}-${skipOffset}-light.svg`}
        alt={label.replace(/{offset}/gi, String(skipOffset))}
        draggable="false"
      />
    </button>
  );
}

export default AudioPlayerSeeker;
