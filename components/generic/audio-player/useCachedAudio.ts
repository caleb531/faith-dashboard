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
      return new Audio();
    }
  );

  // We don't expose the above setter function because losing references to an
  // Audio element means we can no longer control it
  return [audioElement, removeAudioElement];
}

export default useCachedAudio;
