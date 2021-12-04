import React, { useState, useEffect } from 'react';
import { PodcastEpisode } from './Podcast.d';
import useCachedAudio from './useCachedAudio';

function PodcastAudioPlayer({ nowPlaying, isPlaying, dispatch }: { nowPlaying: PodcastEpisode, isPlaying: boolean, dispatch: Function }) {

  const audioUrl = nowPlaying.enclosure['@attributes'].url;

  // Use a single (cached) audio element across all episodes (and even across
  // all podcast instances) so that:
  // 1) If the widget component is completely recreated (e.g. when the widget
  //    is drag-and-dropped to a new dashboard column), the audio playback is
  //    uninterrupted
  // 2) We eliminate any issues of multiple audio streams playing at the same
  //    time
  const audioElement = useCachedAudio(audioUrl);

  // Control the play/pause state of the podcast widget when the appropriate
  // player controls are clicked
  function setIsPlaying(newIsPlaying: boolean) {
    dispatch({ type: 'setIsPlaying', payload: newIsPlaying });
  }

  // Synchronize the audio stream with widget state changes, such that if the
  // audio source URL changes higher up, then the audio will reset here
  useEffect(() => {
    if (audioElement.src !== audioUrl) {
      audioElement.src = audioUrl;
    }
  }, [audioUrl, audioElement]);

  // Synchronize the play/pause state of the audio with the widget state
  useEffect(function () {
    if (isPlaying) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioElement, audioUrl]);

  return (
    <div className="podcast-audio-player">
      {isPlaying ? (
        <button className="podcast-audio-player-pause" onClick={() => setIsPlaying(false)}>
          <img
            className="podcast-audio-player-pause-icon"
            src="icons/pause-light.svg"
            alt="Pause"
            draggable="false" />
        </button>
      ) : (
        <button className="podcast-audio-player-play" onClick={() => setIsPlaying(true)}>
          <img
            className="podcast-audio-player-play-icon"
            src="icons/play-light.svg"
            alt="Play"
            draggable="false" />
        </button>
      )}
    </div>
  );

}

export default PodcastAudioPlayer;
