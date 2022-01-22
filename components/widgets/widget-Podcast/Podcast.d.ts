import { WidgetState } from '../widget.d';

export interface PodcastWidgetState extends WidgetState {
  podcastQuery: string;
  podcastFeedUrl: string;
  podcastImage: string;
  podcastFeedData: PodcastFeedData;
  nowPlaying: PodcastEpisode;
  viewingNowPlaying: boolean;
  isPlaying: boolean;
  listeningMetadata: PodcastListeningMetadata
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
  enclosure: PodcastEpisodeMedia;
  guid: PodcastEpisodeGuid;
  link: string;
  pubDate: string;
  title: string;
}

type PodcastEpisodeGuid = string;

export interface PodcastListeningMetadata {
  [key: PodcastEpisodeGuid]: PodcastListeningMetadataEntry;
}

export interface PodcastListeningMetadataEntry {
  episode: PodcastEpisodeGuid;
  // The number of seconds into the episode audio where the user left off at
  currentTime: number;
}

export interface PodcastFeedData {
  copyright: string;
  description: string;
  language: string;
  link: string;
  title: string;
  item: PodcastEpisode[];
  'itunes:author': string;
  'itunes:image': { href: string };
}

export interface PodcastSearchResponse {
  resultCount: number;
  results: PodcastInfo[]
}

export interface PodcastInfo {
  kind: string;
  trackName: string;
  artistName: string;
  trackId: number;
  artistId: number;
  feedUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl600: string;
}
