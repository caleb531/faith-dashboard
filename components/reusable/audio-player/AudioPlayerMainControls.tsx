import { useContext, useState } from 'react';
import useEventListener from '../../useEventListener';
import AudioPlayerContext from './AudioPlayerContext';
import AudioPlayerPlayPause from './AudioPlayerPlayPause';
import AudioPlayerSkip from './AudioPlayerSkip';

function AudioPlayerMainControls() {
  const { audioElement, audioUrl } = useContext(AudioPlayerContext);

  const [isBuffering, setIsBuffering] = useState(false);

  useEventListener(audioElement, 'waiting', () => {
    setIsBuffering(true);
  });
  useEventListener(audioElement, 'playing', () => {
    setIsBuffering(false);
  });

  const isDisabled = Boolean(
    !audioElement.duration || audioElement.src !== audioUrl
  );

  return (
    <div className="audio-player-main-controls">
      <AudioPlayerSkip
        action="skip-back"
        skipOffset={10}
        label="Skip Back {offset} Seconds"
        isDisabled={isDisabled}
      />
      <AudioPlayerPlayPause
        isDisabled={isDisabled}
        isLoading={isDisabled || isBuffering}
      />
      <AudioPlayerSkip
        action="skip-forward"
        skipOffset={30}
        label="Skip Forward {offset} Seconds"
        isDisabled={isDisabled}
      />
    </div>
  );
}

export default AudioPlayerMainControls;
