import React, { RefObject, useEffect, useRef, useState } from 'react';

// The useAudioSeeker() hook provides attributes that you can attach to an a
// range input (representing your seeker) for the purpose of synchronizing that
// seeker element with your the given current time
function useAudioSeeker(
  audioElement: HTMLAudioElement,
  currentTime: number,
  setCurrentTime: (newCurrentTime: number) => void
): {
  seekerProvided: {
    ref: RefObject<HTMLInputElement>;
    onInput: (event: React.FormEvent<HTMLInputElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLInputElement>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLInputElement>) => void;
  };
} {
  const seekerInputRef = useRef<HTMLInputElement>(null);
  const [isCurrentlySeeking, setIsCurrentlySeeking] = useState(false);

  const [pendingCurrentTime, setPendingCurrentTime] = useState(
    audioElement.currentTime
  );

  // Apply a "fill" to the seeker slider in a cross-browser manner using a CSS
  // gradient
  function updateSeekerFill(input: HTMLInputElement) {
    if (input && audioElement.duration) {
      const fillPercentage =
        (Number(input.value) / audioElement.duration) * 100;
      const fillColor = '#fff';
      const trackColor = 'rgba(0, 0, 0, 0.25)';
      input.style.backgroundColor = 'transparent';
      input.style.backgroundImage = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${fillPercentage}%, ${trackColor} ${fillPercentage}%, ${trackColor} 100%)`;
    }
  }

  // Set the position of the audio seeker when initially loading the player
  useEffect(() => {
    const input = seekerInputRef.current;
    if (input && !isCurrentlySeeking) {
      input.value = String(currentTime);
      updateSeekerFill(input);
    }
  });

  // The following object is to be spread (...) into the element used for the
  // audio seeker
  return {
    seekerProvided: {
      ref: seekerInputRef,
      onInput: (event) => {
        updateSeekerFill(event.currentTarget);
        if (isCurrentlySeeking) {
          setPendingCurrentTime(Number(event.currentTarget.value));
        }
      },
      onMouseDown: () => {
        setIsCurrentlySeeking(true);
      },
      onMouseUp: (event) => {
        audioElement.currentTime = Number(event.currentTarget.value);
        setCurrentTime(audioElement.currentTime);
        setIsCurrentlySeeking(false);
      }
    }
  };
}

export default useAudioSeeker;
