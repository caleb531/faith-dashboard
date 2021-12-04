import { ListenerCallback } from 'workbox-window/utils/WorkboxEventTarget';
import { WidgetState } from '../../types.d';

export interface PodcastWidgetState extends WidgetState {
  podcastUrl: string;
  podcastDetails: PodcastDetails;
  nowPlaying: PodcastEpisodeGuid;
  listeningHistory: ListeningHistory
}

export interface PodcastImage {
  link: string;
  url: string;
  title: object;
}

export interface PodcastEpisodeMedia {
  length: string;
  type: string;
  url: string;
}

export interface PodcastEpisode {
  description: object;
  enclosure: { '@attributes': PodcastEpisodeMedia };
  guid: PodcastEpisodeGuid;
  link: string;
  pubDate: string;
  title: string;
  currentTime?: number;
}

type PodcastEpisodeGuid = string;

export interface ListeningHistory {
  [key: PodcastEpisodeGuid]: ListeningHistoryEntry;
}

export interface ListeningHistoryEntry {
  episode: PodcastEpisodeGuid;
  // The number of seconds into the episode audio where the user left off at
  currentTime: number;
}

export interface PodcastDetails {
  copyright: string;
  description: string;
  image: PodcastImage;
  language: string;
  link: string;
  title: string;
  item: PodcastEpisode[];
}
