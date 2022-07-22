type Props = {
  audioElement: HTMLAudioElement;
  audioUrl: string;
  setCurrentTime: (newCurrentTime: number) => void;
  action: 'skip-back' | 'skip-forward';
  skipOffset: 10 | 30;
  label: string;
};

function AudioPlayerSeeker({
  audioElement,
  audioUrl,
  setCurrentTime,
  action,
  skipOffset,
  label
}: Props) {
  function adjustTime() {
    if (action === 'skip-forward') {
      audioElement.currentTime += skipOffset;
    } else {
      audioElement.currentTime -= skipOffset;
    }
    setCurrentTime(audioElement.currentTime);
  }

  return (
    <button
      className={`audio-player-control audio-player-${action}`}
      onClick={() => adjustTime()}
      disabled={!audioElement.duration || audioElement.src !== audioUrl}
    >
      <img
        className={`audio-player-${action}-icon`}
        src={`/icons/${action}-${skipOffset}-light.svg`}
        alt={label.replace(/{offset}/gi, String(skipOffset))}
        draggable="false"
      />
    </button>
  );
}

export default AudioPlayerSeeker;
