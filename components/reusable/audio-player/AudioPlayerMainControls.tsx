import { useState } from 'react';
import useEventListener from '../../useEventListener';
import AudioPlayerPlayPause from './AudioPlayerPlayPause';
import AudioPlayerSkip from './AudioPlayerSkip';

type Props = {
  audioElement: HTMLAudioElement;
  audioUrl: string;
  isPlaying: boolean;
  setIsPlaying: (newIsPlaying: boolean) => void;
  setCurrentTime: (newCurrentTime: number) => void;
};

function AudioPlayerMainControls({
  audioElement,
  audioUrl,
  isPlaying,
  setIsPlaying,
  setCurrentTime
}: Props) {
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
        audioElement={audioElement}
        audioUrl={audioUrl}
        setCurrentTime={setCurrentTime}
        skipOffset={10}
        action="skip-back"
        label="Skip Back {offset} Seconds"
        isDisabled={isDisabled}
      />
      <AudioPlayerPlayPause
        audioElement={audioElement}
        audioUrl={audioUrl}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isDisabled={isDisabled}
        isLoading={isDisabled || isBuffering}
      />
      <AudioPlayerSkip
        audioElement={audioElement}
        audioUrl={audioUrl}
        setCurrentTime={setCurrentTime}
        skipOffset={30}
        action="skip-forward"
        label="Skip Forward {offset} Seconds"
        isDisabled={isDisabled}
      />
    </div>
  );
}

export default AudioPlayerMainControls;
