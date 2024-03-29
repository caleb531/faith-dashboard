import { useEffect, useRef } from 'react';

// The useMediaSession() hook should receive the same input parameters as the
// MediaMetadata() constructor, along with an additional parameter representing
// the audio element
type UseMediaSessionParameters = ConstructorParameters<
  typeof MediaMetadata
>[0] & {
  audioElement: HTMLAudioElement;
  defaultSeekBackwardOffset?: number;
  defaultSeekForwardOffset?: number;
};

// Clear the current media session for the entire app
function clearMediaSession(): void {
  if (navigator.mediaSession?.metadata) {
    navigator.mediaSession.metadata = null;
  }
}

// A helper function for attaching behavior to Media Session UI actions; not
// all browsers support every action specified by the API, so we wrap each
// handler in a try..catch to prevent client-side errors
function setActionHandler(
  ...args: Parameters<typeof navigator.mediaSession.setActionHandler>
) {
  try {
    navigator.mediaSession.setActionHandler(...args);
  } catch (error) {
    console.log(error);
  }
}

// Update the native Media Session UI when the audio element changes (source:
// https://css-tricks.com/give-users-control-the-media-session-api/#aa-wrapping-up)
function updatePositionState(audioElement: HTMLAudioElement) {
  navigator.mediaSession.setPositionState({
    duration: audioElement.duration,
    playbackRate: audioElement.playbackRate,
    position: audioElement.currentTime
  });
}

// The useMediaSession() hook allows any component to broadcast information
// about the currently-playing audio to the browser- or OS-native audio player
export default function useMediaSession({
  title,
  artist,
  album,
  artwork,
  audioElement,
  defaultSeekBackwardOffset = 15,
  defaultSeekForwardOffset = 15
}: UseMediaSessionParameters): [() => void] {
  // Use a ref to keep track of when the media session's metadata needs to be
  // updated, based on changes to the audio's source URL
  const audioSrcRef = useRef(audioElement.src);
  useEffect(() => {
    // Do nothing if the user's browser does not support the Media Session API
    if (!navigator.mediaSession) {
      return;
    }
    // If nothing is playing anymore, unset the media session
    if (!title || !artist || !album) {
      clearMediaSession();
      return;
    }
    // Do not re-instantiate media session if nothing has changed
    if (audioElement.src === audioSrcRef.current) {
      return;
    }

    const { mediaSession } = navigator;
    mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork
    });
    audioSrcRef.current = audioElement.src;

    setActionHandler('play', () => {
      audioElement.play();
      updatePositionState(audioElement);
    });
    setActionHandler('pause', () => {
      audioElement.pause();
      updatePositionState(audioElement);
    });
    setActionHandler('seekto', (details) => {
      // Not all browsers support fast-seeking for the seekto action, so we
      // first must check if it's supported
      if (details.seekTime && details.fastSeek && audioElement.fastSeek) {
        audioElement.fastSeek(details.seekTime);
      } else if (details.seekTime) {
        audioElement.currentTime = details.seekTime;
      }
      updatePositionState(audioElement);
    });
    setActionHandler('seekbackward', ({ seekOffset }) => {
      audioElement.currentTime = Math.max(
        0,
        audioElement.currentTime - (seekOffset || defaultSeekBackwardOffset)
      );
      updatePositionState(audioElement);
    });
    setActionHandler('seekforward', ({ seekOffset }) => {
      audioElement.currentTime = Math.min(
        audioElement.currentTime + (seekOffset || defaultSeekForwardOffset),
        audioElement.duration
      );
      updatePositionState(audioElement);
    });
  }, [
    title,
    artist,
    album,
    artwork,
    defaultSeekBackwardOffset,
    defaultSeekForwardOffset,
    audioElement
  ]);
  // The clearMediaSession() function is guaranteed to be stable for the
  // lifetime of the component
  return [clearMediaSession];
}
