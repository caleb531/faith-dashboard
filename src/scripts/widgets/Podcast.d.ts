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
  guid: string;
  link: string;
  pubDate: string;
  title: string;
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
