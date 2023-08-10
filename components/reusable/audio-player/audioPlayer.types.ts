export interface AudioPlayerContextType {
  audioElement: HTMLAudioElement;
  audioUrl: string;
  currentTime: number;
  setCurrentTime: (newCurrentTime: number) => void;
  isPlaying: boolean;
  setIsPlaying: (newIsPlaying: boolean) => void;
}
