import React, { useState, useEffect, useRef, useCallback } from 'react';
import { throttle } from 'lodash-es';
import moment from 'moment';
import 'moment-duration-format';
import { PodcastEpisode, PodcastListeningMetadataEntry } from './Podcast.d';
import useCachedAudio from './useCachedAudio';
import useElementEvents from '../../useElementEvents';

function PodcastAudioPlayer({ nowPlaying, nowPlayingMetadata, isPlaying, dispatch }: { nowPlaying: PodcastEpisode, nowPlayingMetadata: PodcastListeningMetadataEntry, isPlaying: boolean, dispatch: Function }) {

  const audioUrl = nowPlaying.enclosure['@attributes'].url;
  const currentTime = nowPlayingMetadata ? nowPlayingMetadata.currentTime : 0;
  const [isFullAudioLoaded, setIsFullAudioLoaded] = useState(false);
  const [isAudioMetadataLoaded, setIsAudioMetadataLoaded] = useState(false);

  // Use a single (cached) audio element across all episodes (and even across
  // all podcast instances) so that:
  // 1) If the widget component is completely recreated (e.g. when the widget
  //    is drag-and-dropped to a new dashboard column), the audio playback is
  //    uninterrupted
  // 2) We eliminate any issues of multiple audio streams playing at the same
  //    time
  const audioElement = useCachedAudio();

  // Control the play/pause state of the podcast widget when the appropriate
  // player controls are clicked
  function setIsPlaying(newIsPlaying: boolean): void {
    dispatch({ type: 'setIsPlaying', payload: newIsPlaying });
  }

  // Return true if audio element's current time (in seconds) differs from
  // what's on the state (also in seconds)
  function hasCurrentTimeChanged(): boolean {
    return Math.floor(audioElement.currentTime) !== Math.floor(currentTime);
  }

  // Save audio element's current time to state if seconds have changed
  function saveCurrentTime(): void {
    if (hasCurrentTimeChanged()) {
      dispatch({
        type: 'updateNowPlayingMetadata',
        payload: { currentTime: audioElement.currentTime }
      });
    }
  }

  // Synchronize the audio stream with widget state changes, such that if the
  // audio source URL changes higher up, then the audio will reset here
  useEffect(() => {
    // Do not update the audio element if we are still on the same episode;
    // this check prevents playback hiccups whenever React re-renders
    if (audioElement.src === audioUrl) {
      return;
    }
    audioElement.src = audioUrl;
    if (hasCurrentTimeChanged()) {
      audioElement.currentTime = currentTime;
    }
  }, [audioUrl, audioElement, nowPlayingMetadata]);

  // Synchronize the play/pause state of the audio with the widget state
  useEffect(function () {
    if (isPlaying) {
      audioElement.play().catch(() => {
        // It is possible for isPlaying to be true when the page initially
        // loads, thus the app will attempt to play the audio element;
        // however, if the browser has blocked the audio from autoplaying,
        // set the audio to paused in the nowPlaying state so that the UI is
        // consistent
        setIsPlaying(false);
      });
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioElement, audioUrl]);

  // Store a ref to the input slider so we can change it dynamically without
  // causing excessive renders on every miniscule slider movement
  const seekerInputRef: {current: HTMLInputElement} = useRef(null);

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
  function updateSeekerFillFromEvent(event: React.FormEvent) {
    updateSeekerFill(event.target as HTMLInputElement);
  }

  // Set the position of the audio seeker when initially loading the player
  function setInitialSeekerPosition(input: HTMLInputElement): void {
    if (input && currentTime) {
      input.value = String(currentTime);
      updateSeekerFill(input);
    }
  }

  // Persist the user's seeking of the audio to the playback metadata
  function seekAudio(event: React.FormEvent): void {
    if (seekerInputRef) {
      audioElement.currentTime = parseFloat((event.target as HTMLInputElement).value);
    }
  }

  useElementEvents(audioElement, {
    loadeddata: () => setIsFullAudioLoaded(true),
    loadedmetadata: () => setIsAudioMetadataLoaded(true),
    // Throttle the timeupdate event so that it doesn't fire excessively when
    // the user is seeking the audio (via the slider)
    timeupdate: throttle(() => {
      if (isPlaying) {
        saveCurrentTime();
      }
    })
  });

  return (
    <div className="podcast-audio-player">
      <button className="podcast-audio-player-playpause" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? (
          <img
            className="podcast-audio-player-playpause-icon"
            src="icons/pause-light.svg"
            alt="Pause"
            draggable="false" />
        ) : (
          <img
            className="podcast-audio-player-playpause-icon"
            src="icons/play-light.svg"
            alt="Play"
            draggable="false" />
        )}
      </button>
      <div className="podcast-audio-player-seeker-container">
        <input
          type="range"
          className="podcast-audio-player-seeker-slider"
          name="seeker"
          min="0"
          max={audioElement.duration || 0}
          step="1"
          onChange={seekAudio}
          onInput={updateSeekerFillFromEvent}
          onMouseUp={saveCurrentTime}
          ref={setInitialSeekerPosition} />
        <div className="podcast-audio-player-time-info">
          <span className="podcast-audio-player-current-time">
            {!audioElement.duration ?
              'Loading...' :
              audioElement.currentTime >= 1 ?
              moment.duration(Math.floor(audioElement.currentTime), 'seconds').format() :
              '0:00'
            }
          </span>
          <span className="podcast-audio-player-time-remaining">{audioElement.duration ?
            Math.round(audioElement.duration - audioElement.currentTime) > 0 ?
            `-${moment.duration(audioElement.duration - audioElement.currentTime, 'seconds').format()}`
            : '0:00'
           : null}</span>
        </div>
      </div>
    </div>
  );

}

export default PodcastAudioPlayer;
