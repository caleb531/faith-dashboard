import React from 'react';

// The useAudioSeeker() hook provides attributes that you can attach to an a
// range input (representing your seeker) for the purpose of synchronizing that
// seeker element with your the given current time
function useAudioSeeker(audioElement: HTMLAudioElement, currentTime: number, setCurrentTime: (newCurrentTime: number) => void): { seekerProvided: {
  ref: (input: HTMLInputElement) => void,
  onInput: (event: React.FormEvent) => void,
  onChange: (event: React.FormEvent) => void,
  onMouseUp: () => void
} } {

  // Apply a "fill" to the seeker slider in a cross-browser manner using a CSS
  // gradient
  function updateSeekerFill(input: HTMLInputElement) {
    if (input && audioElement.currentTime && audioElement.duration) {
      const fillPercentage = audioElement.currentTime / audioElement.duration * 100;
      const fillColor = '#fff';
      const trackColor = 'rgba(0, 0, 0, 0.25)';
      input.style.backgroundColor = 'transparent';
      input.style.backgroundImage = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${fillPercentage}%, ${trackColor} ${fillPercentage}%, ${trackColor} 100%)`;
    }
  }
  function updateSeekerFillFromEvent(event: React.FormEvent<HTMLInputElement>) {
    updateSeekerFill(event.currentTarget);
  }

  // Set the position of the audio seeker when initially loading the player
  function setInitialSeekerPosition(input: HTMLInputElement): void {
    if (input && currentTime) {
      input.value = String(currentTime);
      updateSeekerFill(input);
    }
  }

  // Persist the user's seeking of the audio to the playback metadata
  function seekAudio(event: React.FormEvent<HTMLInputElement>): void {
    audioElement.currentTime = parseFloat(event.currentTarget.value);
  }

  // The following object is to be spread (...) into the element used for the
  // audio seeker
  return {
    seekerProvided: {
      ref: setInitialSeekerPosition,
      onInput: updateSeekerFillFromEvent,
      onChange: seekAudio,
      onMouseUp: () => setCurrentTime(audioElement.currentTime)
    }
  };

}

export default useAudioSeeker;
