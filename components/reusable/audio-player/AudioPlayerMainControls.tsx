import { useContext } from 'react';
import AudioPlayerContext from './AudioPlayerContext';
import AudioPlayerPlayPause from './AudioPlayerPlayPause';
import AudioPlayerSkip from './AudioPlayerSkip';

function AudioPlayerMainControls() {
  const { audioElement, audioUrl } = useContext(AudioPlayerContext);

  const isInitiallyBuffering = Boolean(
    // When the src changes, the duration from the previous audio source is
    // still present until the metadata for the new audio source has loaded;
    // hence the reason for the second half of this condition
    !audioElement.duration || audioElement.src !== audioUrl
  );

  return (
    <div className="audio-player-main-controls">
      <AudioPlayerSkip
        action="skip-back"
        skipOffset={10}
        label="Skip Back {offset} Seconds"
        isDisabled={isInitiallyBuffering}
      />
      <AudioPlayerPlayPause isDisabled={isInitiallyBuffering} />
      <AudioPlayerSkip
        action="skip-forward"
        skipOffset={30}
        label="Skip Forward {offset} Seconds"
        isDisabled={isInitiallyBuffering}
      />
    </div>
  );
}

export default AudioPlayerMainControls;
