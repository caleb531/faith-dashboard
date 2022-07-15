import { useEffect } from 'react';
import useCachedState from '../../useCachedState';

// The useCachedAudio() hook stores one or more HTML5 Audio elements for
// playing audio; these Audio elements are created and cached according to the
// string key that is provided; this key should probably be the widget ID in
// most cases, such that each widget has its own (dedicated) audio element, and
// can re-use that audio element for each episode played within that widget
function useCachedAudio(cacheKey: string): [HTMLAudioElement, () => void] {
  const [audioElement, setAudioElement, removeAudioElement] = useCachedState(
    `podcast-audio-${cacheKey}`,
    () => {
      const audioElement = document.createElement('audio');
      // Setting preload=metadata on the initial audio element fixes a nasty
      // iOS bug where setting currentTime would be ineffective; the audio
      // would always start from the beginning when played
      audioElement.preload = 'metadata';
      return audioElement;
    }
  );

  // Due to the way useCachedState() works, the audio element persists across
  // component unmounts/remounts; however, my tests will frequently need to
  // remove all audio instances between each test; therefore, we provide my
  // tests with a mechanism to properly remove these internal audio elements
  // from the cache if, on component unmount, we see that the audio element is
  // actually a mock
  useEffect(() => {
    return () => {
      if ('_isAudioMock' in audioElement) {
        removeAudioElement();
      }
    };
  }, [audioElement, removeAudioElement]);

  // We don't expose the above setter function because losing references to an
  // Audio element means we can no longer control it
  return [audioElement, removeAudioElement];
}

export default useCachedAudio;
