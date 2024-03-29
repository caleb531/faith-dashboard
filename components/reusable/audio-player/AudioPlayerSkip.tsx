import { useContext } from 'react';
import Button from '../Button';
import Icon from '../Icon';
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
    <Button
      className={`audio-player-control audio-player-${action}`}
      onClick={() => adjustTime()}
      disabled={isDisabled}
    >
      <Icon
        name={`${action}-${skipOffset}-light`}
        alt={label.replace(/{offset}/gi, String(skipOffset))}
      />
    </Button>
  );
}

export default AudioPlayerSeeker;
