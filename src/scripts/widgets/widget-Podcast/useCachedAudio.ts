import useCachedState from '../../useCachedState';

// The useCachedAudio() hook stores a single HTML5 Audio element to play all
// audio throughout the application; this is to avoid issues of multiple Audio
// elements playing at the same time; see the PodcastAudioPlayer component for
// more reasons for this
function useCachedAudio(): HTMLAudioElement {

  const [audioElement, setAudioElement] = useCachedState<HTMLAudioElement>('podcast-audio-global', () => {
    return new Audio();
  });

  return audioElement;

}

export default useCachedAudio;
