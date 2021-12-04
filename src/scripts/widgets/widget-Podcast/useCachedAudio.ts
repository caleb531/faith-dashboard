// The storage variable for the cached Audio element
let cachedAudioElement: HTMLAudioElement = null;

// Store a single HTML5 Audio element to play all audio throughout the
// application; this is to avoid issues of multiple Audio elements playing at
// the same time; see the PodcastPlayer component for more reasons for this
function useCachedAudio(sourceUrl: string) {

  if (cachedAudioElement) {
    return cachedAudioElement;
  } else {
    cachedAudioElement = new Audio(sourceUrl);
    return cachedAudioElement;
  }

}

export default useCachedAudio;
