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
  const { seekerProvided, currentTimestamp, remainingTimestamp } =
    useAudioSeeker(audioElement, audioUrl, currentTime, setCurrentTime);
  useAudioTime(audioElement, audioUrl, currentTime, setCurrentTime);

  // The number of seconds of audio to either skip back or skip forward
  const skipBackOffset = 30;
  const skipForwardOffset = 30;

  function adjustTime(offset: number) {
    audioElement.currentTime += offset;
    // Make sure the audio timestamps (which, to achieve the desired UX, are
    // based on the current slider value) reflect the new audio time
    // immediately (i.e. don't wait for the next tick of the audio to update
    // the timestamps)
    if (seekerProvided.ref.current) {
      seekerProvided.ref.current.value = String(audioElement.currentTime);
    }
    setCurrentTime(audioElement.currentTime);
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
          defaultValue={audioElement.currentTime}
          {...seekerProvided}
        />
        <div className="audio-player-time-info">
          <span className="audio-player-current-time">{currentTimestamp}</span>
          <span className="audio-player-time-remaining">
            {remainingTimestamp}
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
