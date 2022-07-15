import { intervalToDuration } from 'date-fns';
import React, { RefObject, useEffect, useRef, useState } from 'react';

// The useAudioSeeker() hook provides attributes that you can attach to an a
// range input (representing your seeker) for the purpose of synchronizing that
// seeker element with your the given current time
function useAudioSeeker(
  audioElement: HTMLAudioElement,
  audioUrl: string,
  currentTime: number,
  setCurrentTime: (newCurrentTime: number) => void
): {
  seekerProvided: {
    ref: RefObject<HTMLInputElement>;
    onInput: (event: React.FormEvent<HTMLInputElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLInputElement>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLInputElement>) => void;
  };
  currentTimestamp: string;
  remainingTimestamp: string;
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

  // Zero-pad the given number if it's a single-digit; used for computing
  // hh:mm:ss timestamps in the below formatSecondsAsTimestamp() function
  function padWithZero(value: number): string {
    return value < 10 ? `0${value}` : String(value);
  }

  // Format the given number of seconds
  function formatSecondsAsTimestamp(totalSeconds: number): string {
    const { hours, minutes, seconds } = intervalToDuration({
      start: 0,
      end: Math.floor(totalSeconds) * 1000
    });
    if (hours) {
      return [hours, padWithZero(minutes!), padWithZero(seconds!)].join(':');
    } else if (minutes || seconds) {
      return [minutes || 0, padWithZero(seconds || 0)].join(':');
    } else {
      return '';
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

  // Re-render component when seeker input initially mounts; this is to ensure
  // there is no discontinuity in the audio timestamps when dragging the widget
  // to a new column
  useEffect(() => {
    if (seekerInputRef.current) {
      setPendingCurrentTime(Number(seekerInputRef.current.value));
    }
  }, [seekerInputRef]);

  const currentTimeForTimestamp =
    isCurrentlySeeking && seekerInputRef.current
      ? Number(seekerInputRef.current.value)
      : audioElement.currentTime;

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
    },

    currentTimestamp:
      !audioElement.duration ||
      audioElement.src !== audioUrl ||
      !seekerInputRef.current
        ? 'Loading...'
        : seekerInputRef.current && Number(seekerInputRef.current.value) >= 1
        ? formatSecondsAsTimestamp(Math.floor(currentTimeForTimestamp))
        : '0:00',

    remainingTimestamp:
      audioElement.duration &&
      audioElement.src === audioUrl &&
      seekerInputRef.current
        ? Math.round(audioElement.duration - currentTimeForTimestamp) > 0
          ? `-${formatSecondsAsTimestamp(
              audioElement.duration - currentTimeForTimestamp
            )}`
          : '0:00'
        : ''
  };
}

export default useAudioSeeker;
