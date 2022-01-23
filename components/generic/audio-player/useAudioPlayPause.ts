import useEventListener from '../../useEventListener';

// The useAudioPlayPause() hook synchronizes the Play/Pause state of an Audio
// element with whatever internal state you desire (according to the
// setIsPlaying callback that you supply)
function useAudioPlayPause(audioElement: HTMLAudioElement, isPlaying: boolean, setIsPlaying: (isPlaying: boolean) => void): void {

  // Synchronize the play/pause state of the audio with the widget state
  useEventListener(audioElement, 'play', () => setIsPlaying(true));
  useEventListener(audioElement, 'pause', () => setIsPlaying(false));

}

export default useAudioPlayPause;
