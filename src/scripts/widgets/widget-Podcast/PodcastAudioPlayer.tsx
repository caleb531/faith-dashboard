import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import 'moment-duration-format';
import { PodcastEpisode, PodcastListeningMetadataEntry } from './Podcast.d';
import useCachedAudio from './useCachedAudio';
import useElementEvents from '../../useElementEvents';

function PodcastAudioPlayer({ nowPlaying, nowPlayingMetadata, isPlaying, dispatch }: { nowPlaying: PodcastEpisode, nowPlayingMetadata: PodcastListeningMetadataEntry, isPlaying: boolean, dispatch: Function }) {

  const audioUrl = nowPlaying.enclosure['@attributes'].url;
  const [isFullAudioLoaded, setIsFullAudioLoaded] = useState(false);
  const [isAudioMetadataLoaded, setIsAudioMetadataLoaded] = useState(false);

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

  useElementEvents(audioElement, {
    loadeddata: () => setIsFullAudioLoaded(true),
    loadedmetadata: () => setIsAudioMetadataLoaded(true),
    timeupdate: () => {
      if (!nowPlayingMetadata || Math.floor(audioElement.currentTime) !== Math.floor(nowPlayingMetadata.currentTime)) {
        dispatch({
          type: 'updateNowPlayingMetadata',
          payload: {
            currentTime: audioElement.currentTime
          }
        });
      }
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
        {audioElement.duration ? (
          <div className="podcast-audio-player-time-info">
            <span className="podcast-audio-player-current-time">
              {audioElement.currentTime >= 1 ?
                moment.duration(audioElement.currentTime, 'seconds').format() :
                '00:00'
              }
            </span>
            <span className="podcast-audio-player-time-remaining">-{moment.duration(audioElement.duration - audioElement.currentTime, 'seconds').format()}</span>
          </div>
        ) : null}
      </div>
    </div>
  );

}

export default PodcastAudioPlayer;
