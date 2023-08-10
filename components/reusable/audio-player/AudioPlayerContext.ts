import { createContext } from 'react';
import { AudioPlayerContextType } from './audioPlayer.types';

// @ts-ignore (the AudioPlayerContext will be initiailized with a non-null
// value in my top-level AudioPlayer component)
const AudioPlayerContext = createContext<AudioPlayerContextType>({});
export default AudioPlayerContext;
