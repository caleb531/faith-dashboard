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

  const seekerFieldId = useUniqueFieldId('audio-player-seeker-slider');
  return (
    <div className="audio-player-seeker-container">
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
    </div>
  );
}

export default AudioPlayerSeeker;
