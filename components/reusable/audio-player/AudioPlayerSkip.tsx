type Props = {
  audioElement: HTMLAudioElement;
  setCurrentTime: (newCurrentTime: number) => void;
  action: 'skip-back' | 'skip-forward';
  skipOffset: number;
  label: string;
};

function AudioPlayerSeeker({
  audioElement,
  setCurrentTime,
  action,
  skipOffset,
  label
}: Props) {
  function adjustTime() {
    audioElement.currentTime += skipOffset;
    setCurrentTime(audioElement.currentTime);
  }

  return (
    <button
      className={`audio-player-control audio-player-${action}`}
      onClick={() => adjustTime()}
      disabled={!Boolean(audioElement.duration)}
    >
      <img
        className={`audio-player-${action}-icon`}
        src={`/icons/${action}-30-light.svg`}
        alt={label.replace(/{offset}/gi, String(Math.abs(skipOffset)))}
        draggable="false"
      />
    </button>
  );
}

export default AudioPlayerSeeker;
