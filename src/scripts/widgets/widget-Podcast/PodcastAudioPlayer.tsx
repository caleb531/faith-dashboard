import React, { useState, useEffect, useCallback } from 'react';
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

  useElementEvents(audioElement, {
    loadeddata: () => setIsFullAudioLoaded(true),
    loadedmetadata: () => setIsAudioMetadataLoaded(true),
    timeupdate: () => {
      saveCurrentTime();
    }
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
      <div className="podcast-audio-player-scrubber-container">
        <div className="podcast-audio-player-time-info">
          <span className="podcast-audio-player-current-time">
            {audioElement.currentTime >= 1 ?
              moment.duration(audioElement.currentTime, 'seconds').format() :
              '0:00'
            }
          </span>
          <span className="podcast-audio-player-time-remaining">{audioElement.duration ? `-${moment.duration(audioElement.duration - audioElement.currentTime, 'seconds').format()}` : '--:--'}</span>
        </div>
      </div>
    </div>
  );

}

export default PodcastAudioPlayer;
