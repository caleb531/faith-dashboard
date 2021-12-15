import useCachedState from '../../useCachedState';

// The useCachedAudio() hook stores one or more HTML5 Audio elements for
// playing audio; these Audio elements are created and cached according to the
// string key that is provided; this key should probably be the widget ID in
// most cases, such that each widget has its own (dedicated) audio element, and
// can re-use that audio element for each episode played within that widget
function useCachedAudio(cacheKey: string): HTMLAudioElement {

  const [audioElement] = useCachedState<HTMLAudioElement>(`podcast-audio-${cacheKey}`, () => {
    return new Audio();
  });

  return audioElement;

}

export default useCachedAudio;
