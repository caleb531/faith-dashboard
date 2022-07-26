import useMemoizedContextValue from '../../useMemoizedContextValue';
import AudioPlayerContext from './AudioPlayerContext';
import AudioPlayerMainControls from './AudioPlayerMainControls';
import AudioPlayerSeeker from './AudioPlayerSeeker';
import useAudioLoader from './useAudioLoader';
import useCachedAudio from './useCachedAudio';

type Props = {
  audioElementKey: string;
  audioUrl: string;
  currentTime: number;
  setCurrentTime: (newCurrentTime: number) => void;
  isPlaying: boolean;
  setIsPlaying: (newIsPlaying: boolean) => void;
};

function AudioPlayer({
  audioElementKey,
  audioUrl,
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying
}: Props) {
  // Use a single (cached) audio element across all episodes (however, still
  // per Widget) so that:
  // 1) If a widget component is completely recreated (e.g. when the widget is
  //    drag-and-dropped to a new dashboard column), the audio playback is
  //    uninterrupted
  // 2) We eliminate any issues of multiple audio streams playing at the same
  //    time (at least within the same widget)
  const [audioElement] = useCachedAudio(audioElementKey);

  useAudioLoader(audioElement);

  const contextValue = useMemoizedContextValue({
    audioElement,
    audioUrl,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying
  });

  return (
    <div className="audio-player">
      <AudioPlayerContext.Provider value={contextValue}>
        <AudioPlayerMainControls />
        <AudioPlayerSeeker />
      </AudioPlayerContext.Provider>
    </div>
  );
}

export default AudioPlayer;
