import { intervalToDuration } from 'date-fns';
import useUniqueFieldId from '../../useUniqueFieldId';
import useAudioSeeker from './useAudioSeeker';
import useAudioTime from './useAudioTime';

type Props = {
  audioElement: HTMLAudioElement;
  audioUrl: string;
  currentTime: number;
  setCurrentTime: (newCurrentTime: number) => void;
};

function AudioPlayerSeeker({
  audioElement,
  audioUrl,
  currentTime,
  setCurrentTime
}: Props) {
  const { seekerProvided } = useAudioSeeker(
    audioElement,
    currentTime,
    setCurrentTime
  );
  useAudioTime(audioElement, audioUrl, currentTime, setCurrentTime);

  // The number of seconds of audio to either skip back or skip forward
  const skipBackOffset = 30;
  const skipForwardOffset = 30;

  function adjustTime(offset: number) {
    setCurrentTime(audioElement.currentTime + offset);
    audioElement.currentTime += offset;
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
    if (hours && minutes && seconds) {
      return [hours, padWithZero(minutes), padWithZero(seconds)].join(':');
    } else if (minutes || seconds) {
      return [minutes || 0, padWithZero(seconds || 0)].join(':');
    } else {
      return '';
    }
  }

  const seekerFieldId = useUniqueFieldId('audio-player-seeker-slider');
  return (
    <div className="audio-player-seeker-container">
      <button
        className="audio-player-control audio-player-skip-back"
        onClick={() => adjustTime(-skipBackOffset)}
      >
        <img
          className="audio-player-skip-back-icon"
          src="/icons/skip-back-30-light.svg"
          alt="Skip Back 30 Seconds"
          draggable="false"
        />
      </button>
      <div className="audio-player-seeker-slider-container">
        <label htmlFor={seekerFieldId} className="search accessibility-only">
          Audio Progress
        </label>
        <input
          type="range"
          id={seekerFieldId}
          className="audio-player-seeker-slider"
          name="seeker"
          min="0"
          max={audioElement.duration || 0}
          step="1"
          disabled={!audioElement.duration}
          {...seekerProvided}
        />
        <div className="audio-player-time-info">
          <span className="audio-player-current-time">
            {!audioElement.duration || audioElement.src !== audioUrl
              ? 'Loading...'
              : audioElement.currentTime >= 1
              ? formatSecondsAsTimestamp(Math.floor(audioElement.currentTime))
              : '0:00'}
          </span>
          <span className="audio-player-time-remaining">
            {audioElement.duration && audioElement.src === audioUrl
              ? Math.round(audioElement.duration - audioElement.currentTime) > 0
                ? `-${formatSecondsAsTimestamp(
                    audioElement.duration - audioElement.currentTime
                  )}`
                : '0:00'
              : null}
          </span>
        </div>
      </div>
      <button
        className="audio-player-control audio-player-skip-forward"
        onClick={() => adjustTime(skipForwardOffset)}
      >
        <img
          className="audio-player-skip-forward-icon"
          src="/icons/skip-forward-30-light.svg"
          alt="Skip Forward 30 Seconds"
          draggable="false"
        />
      </button>
    </div>
  );
}

export default AudioPlayerSeeker;
