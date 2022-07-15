import { useState } from 'react';
import useEventListener from '../../useEventListener';

// The useAudioLoader() hook returns variables that indicate when an audio
// track (represented by the given Audio element) has loaded at different
// stages
function useAudioLoader(audioElement: HTMLAudioElement): [boolean, boolean] {
  const [isAudioMetadataLoaded, setIsAudioMetadataLoaded] = useState(false);
  const [isFullAudioLoaded, setIsFullAudioLoaded] = useState(false);

  useEventListener(
    audioElement,
    'loadedmetadata',
    () => {
      setIsAudioMetadataLoaded(true);
    },
    [setIsAudioMetadataLoaded]
  );

  useEventListener(
    audioElement,
    'loadeddata',
    () => {
      setIsFullAudioLoaded(true);
    },
    [setIsFullAudioLoaded]
  );

  return [isAudioMetadataLoaded, isFullAudioLoaded];
}

export default useAudioLoader;
