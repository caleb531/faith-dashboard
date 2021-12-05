import { useState } from 'react';
import useElementEvents from '../../useElementEvents';

// The useAudioLoader() hook returns variables that indicate when an audio
// track (represented by the given Audio element) has loaded at different
// stages
function useAudioLoader(audioElement: HTMLAudioElement): [boolean, boolean] {

  const [isAudioMetadataLoaded, setIsAudioMetadataLoaded] = useState(false);
  const [isFullAudioLoaded, setIsFullAudioLoaded] = useState(false);

  useElementEvents(audioElement, {
    loadeddata: () => setIsFullAudioLoaded(true),
    loadedmetadata: () => setIsAudioMetadataLoaded(true)
  });

  return [isAudioMetadataLoaded, isFullAudioLoaded];

}

export default useAudioLoader;
