import { useEffect, useRef } from 'react';
import useEventListener from '../../useEventListener';

// The useAudioTime() hook exposes a setter that allows you to synchronize the
// current time of the given Audio element to whatever internal state you so
// desire
function useAudioTime(audioElement: HTMLAudioElement, audioUrl: string, currentTime: number, setCurrentTime: (newCurrentTime: number) => void): void {

  // Store the latest value from currentTime in a ref so that
  // hasCurrentTimeChanged() always has access to the latest value of
  // currentTime; this is important because, for performance, we only bind the
  // timeupdate() listener once for the lifetime of the Audio
  // element (rather than being constantly bound and un-bound for every second
  // of playback when the component re-rendered, as was the case previously)
  const currentTimeRef = useRef(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // Return true if audio element's current time (in seconds) differs from
  // what's on the state (also in seconds)
  function hasCurrentTimeChanged(): boolean {
    return Math.floor(audioElement.currentTime) !== Math.floor(currentTimeRef.current);
  }

  // Update the listening history as the audio is playing
  useEventListener(audioElement, 'timeupdate', () => {
    // The timeupdate() event appears to run several times every second, at
    // least in Chromium-based browsers; however, since we are only displaying
    // the times in second-precision in the UI, we can reduce excessive
    // rendering by checking if the Audio element's current time is at least
    // one second difference from the state's current time
    if (hasCurrentTimeChanged()) {
      setCurrentTime(audioElement.currentTime);
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
    audioElement.currentTime = currentTime;
  }, [audioUrl, audioElement]);

}

export default useAudioTime;
