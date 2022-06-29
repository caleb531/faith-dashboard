import { createContext, Dispatch } from 'react';
import { PodcastAction } from './PodcastReducer';

// @ts-ignore (the PodcastContext will be initiailized with a non-null value in
// my top-level Podcast component)
const PodcastContext = createContext<Dispatch<PodcastAction>>({});
export default PodcastContext;
