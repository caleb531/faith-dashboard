// The storage variable for the cached Audio element
let cachedAudioElement: HTMLAudioElement = null;

// The useCachedAudio() hook stores a single HTML5 Audio element to play all
// audio throughout the application; this is to avoid issues of multiple Audio
// elements playing at the same time; see the PodcastAudioPlayer component for
// more reasons for this
function useCachedAudio(initialSourceUrl: string): HTMLAudioElement {

  if (cachedAudioElement) {
    return cachedAudioElement;
  } else {
    cachedAudioElement = new Audio(initialSourceUrl);
    return cachedAudioElement;
  }

}

export default useCachedAudio;
