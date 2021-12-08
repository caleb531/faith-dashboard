import { useEffect } from 'react';
import useElementEvents from '../../useElementEvents';

// The useAudioTime() hook exposes a setter that allows you to synchronize the
// current time of the given Audio element to whatever internal state you so
// desire
function useAudioTime(audioElement: HTMLAudioElement, audioUrl: string, isPlaying: boolean, currentTime: number, setCurrentTime: () => void): void {

  // Return true if audio element's current time (in seconds) differs from
  // what's on the state (also in seconds)
  function hasCurrentTimeChanged(): boolean {
    return Math.floor(audioElement.currentTime) !== Math.floor(currentTime);
  }

  useElementEvents(audioElement, {
    // Update the listening history as the audio is playing
    timeupdate: () => {
      if (isPlaying) {
        if (hasCurrentTimeChanged()) {
          setCurrentTime();
        }
      }
    }
  });

  // Synchronize the audio stream with widget state changes, such that if the
  // audio source URL changes higher up, then the audio will reset here
  useEffect(() => {
    // Do not update the audio element if we are still on the same episode;
    // this check prevents playback hiccups whenever the widget
    // unmounts/re-mounts (e.g. when the widget is dragged to a new column)
    if (audioElement.src === audioUrl) {
      return;
    }
    audioElement.src = audioUrl;
    if (hasCurrentTimeChanged()) {
      audioElement.currentTime = currentTime;
    }
  }, [audioUrl, audioElement]);

}

export default useAudioTime;
