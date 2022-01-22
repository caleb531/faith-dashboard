/* global MediaMetadata */

import { useEffect } from 'react';

// The useMediaSession() hook should receive the same input parameters as the
// MediaMetadata() constructor, along with an additional parameter representing
// the audio element
type UseMediaSessionParameters = ConstructorParameters<typeof MediaMetadata>[0] & {
  audioElement: HTMLAudioElement,
  seekBackwardSeconds?: number,
  seekForwardSeconds?: number
};

// Clear the current media session for the entire app
function clearMediaSession(): void {
  if (navigator.mediaSession.metadata) {
    console.log('CLEARRRRRRR UH OH');
    navigator.mediaSession.metadata = null;
  }
}

// The useMediaSession() hook allows any component to broadcast information
// about the currently-playing audio to the browser- or OS-native audio player
export default function useMediaSession({
  title,
  artist,
  album,
  artwork,
  audioElement,
  seekBackwardSeconds,
  seekForwardSeconds
}: UseMediaSessionParameters): [() => void] {

  useEffect(() => {
    if (!title || !artist || !album) {
      clearMediaSession();
      return;
    }
    const { mediaSession } = navigator;
    mediaSession.metadata = new MediaMetadata({ title, artist, album, artwork });
    if (seekBackwardSeconds) {
      mediaSession.setActionHandler('seekbackward', () => {
        audioElement.currentTime = Math.max(
          0,
          audioElement.currentTime - seekBackwardSeconds
        );
      });
    }
    if (seekForwardSeconds) {
      mediaSession.setActionHandler('seekforward', () => {
        audioElement.currentTime = Math.min(
          audioElement.currentTime + seekForwardSeconds,
          audioElement.duration
        );
      });
    }
  }, [title, artist, album, artwork, seekBackwardSeconds, seekForwardSeconds, audioElement]);

  // The clearMediaSession() function is guaranteed to be stable for the
  // lifetime of the component
  return [clearMediaSession];

}

