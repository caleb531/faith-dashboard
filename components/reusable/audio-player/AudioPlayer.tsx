import React from 'react';
import AudioPlayerPlayPause from './AudioPlayerPlayPause';
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

  return (
    <div className="audio-player">
      <AudioPlayerPlayPause
        audioElement={audioElement}
        audioUrl={audioUrl}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
      <AudioPlayerSeeker
        audioElement={audioElement}
        audioUrl={audioUrl}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
      />
    </div>
  );
}

export default AudioPlayer;