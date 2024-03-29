import Button from '@components/reusable/Button';
import { useCallback, useContext } from 'react';
import AudioPlayer from '../../reusable/audio-player/AudioPlayer';
import PodcastContext from './PodcastContext';
import { PodcastEpisode, PodcastWidgetState } from './podcast.types';

type Props = {
  widget: PodcastWidgetState;
  nowPlaying: PodcastEpisode;
  isPlaying: boolean;
};

function PodcastNowPlaying({
  widget: { id, podcastImage, podcastFeedData, listeningMetadata },
  nowPlaying,
  isPlaying
}: Props) {
  const dispatchToWidget = useContext(PodcastContext);

  // The nowPlaying object is guaranteed to exist, given how we use this
  // component in Podcast.tsx
  const nowPlayingMetadata = listeningMetadata[nowPlaying.guid];

  const audioUrl = nowPlaying.enclosure.url;
  const currentTime = nowPlayingMetadata ? nowPlayingMetadata.currentTime : 0;

  const setCurrentTime = useCallback(
    (newCurrentTime: number) => {
      dispatchToWidget({
        type: 'updateNowPlayingMetadata',
        payload: { currentTime: newCurrentTime }
      });
    },
    [dispatchToWidget]
  );

  // Control the play/pause state of the podcast widget when the appropriate
  // player controls are clicked
  const setIsPlaying = useCallback(
    (newIsPlaying: boolean) => {
      dispatchToWidget({ type: 'setIsPlaying', payload: newIsPlaying });
    },
    [dispatchToWidget]
  );

  function returnToEpisodeList() {
    dispatchToWidget({ type: 'setViewingNowPlaying', payload: false });
  }

  return (
    <section className="podcast-view-now-playing">
      <header className="podcast-now-playing-header">
        {podcastImage ? (
          <img
            className="podcast-now-playing-image"
            src={podcastImage}
            alt=""
            data-testid="podcast-image"
          />
        ) : (
          <div
            className="podcast-now-playing-image podcast-now-playing-image-missing"
            data-testid="podcast-image"
          >
            ?
          </div>
        )}
        <section className="podcast-now-playing-episode-info">
          <h2 className="podcast-now-playing-episode-title">
            {nowPlaying.title}
          </h2>
        </section>
      </header>
      <div className="podcast-now-playing-audio-player-container">
        <AudioPlayer
          audioElementKey={id}
          audioUrl={audioUrl}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>
      <footer className="podcast-now-playing-footer">
        <Button
          className="podcast-now-playing-return-to-list"
          onClick={returnToEpisodeList}
        >
          Return to List
        </Button>
      </footer>
    </section>
  );
}

export default PodcastNowPlaying;
