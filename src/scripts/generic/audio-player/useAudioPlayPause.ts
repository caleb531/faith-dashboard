import { useEffect } from 'react';

// The useAudioPlayPause() hook synchronizes the Play/Pause state of an Audio
// element with whatever internal state you desire (according to the
// setIsPlaying callback that you supply)
function useAudioPlayPause(audioElement: HTMLAudioElement, isPlaying: boolean, setIsPlaying: (isPlaying: boolean) => void): void {

  // Synchronize the play/pause state of the audio with the widget state
  useEffect(function () {
    if (isPlaying) {
      audioElement.play().catch((error) => {
        console.log(error);
        // It is possible for isPlaying to be true when the page initially
        // loads, thus the app will attempt to play the audio element;
        // however, if the browser has blocked the audio from autoplaying,
        // set the audio to paused in the nowPlaying state so that the UI is
        // consistent
        setIsPlaying(false);
      });
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioElement]);

}

export default useAudioPlayPause;
