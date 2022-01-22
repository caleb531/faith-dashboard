/* global MediaMetadata */

import { useEffect } from 'react';

// The useMediaSession() hook should receive the same input parameters as the
// MediaMetadata() constructor, along with an additional parameter representing
// the audio element
type UseMediaSessionParameters = ConstructorParameters<typeof MediaMetadata>[0] & {
  audioElement: HTMLAudioElement
};

export default function useMediaSession({ title, artist, album, artwork, audioElement }: UseMediaSessionParameters) {

  useEffect(() => {
    if (!title || !artist || !album || !artwork) {
      return;
    }
    const { mediaSession } = navigator;
    mediaSession.metadata = new MediaMetadata({ title, artist, album, artwork });
    mediaSession.setActionHandler('play', () => audioElement.play());
    mediaSession.setActionHandler('pause', () => audioElement.pause());
  }, [title, artist, album, artwork, audioElement]);

}
