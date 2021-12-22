import { PodcastFeedData, PodcastWidgetState } from './podcast.d';

export type PodcastAction =
  { type: 'setPodcastFeedData', payload: PodcastFeedData } |
  { type: 'setPodcastQuery', payload: string } |
  { type: 'setPodcastFeedUrl', payload: string } |
  { type: 'setPodcastImage', payload: string } |
  { type: 'setNowPlaying', payload: string } |
  { type: 'setIsPlaying', payload: boolean } |
  { type: 'setViewingNowPlaying', payload: boolean } |
  { type: 'updateNowPlayingMetadata', payload: { currentTime: number } };

export default function reducer(state: PodcastWidgetState, action: PodcastAction): PodcastWidgetState {
  switch (action.type) {
    case 'setPodcastFeedData':
      const podcastFeedData = action.payload;
      return {
        ...state,
        podcastFeedData: {
          ...podcastFeedData,
          item: podcastFeedData.item
            // Some podcasts have bad data episode details without any media
            // information attached to them; filter these out
            .filter((episode) => episode.enclosure)
            .map((episode) => {
              return {
                ...episode,
                // For most podcasts the GUID for each episode will be unique
                // and safe to use throughout this application; however, some
                // podcasts use the same @attributes object for each and every
                // one of their episode GUIDs; this will cause React to throw a
                // "two children with the same key" error, since we use the
                // GUID to uniquely identify an episode in many areas of the
                // Podcast widget code; to solve this, we need to assign some
                // other value from the episode schemat
                // can't be something we generate ourselves because the GUID
                // cannot change across feed refreshes, lest we lose listening
                // history, etc.)
                guid: typeof episode.guid !== 'string' ?
                  (episode.enclosure['@attributes'].url || episode.title) :
                  episode.guid
              };
            })
        }
      };
    case 'setPodcastQuery':
      const podcastQuery = action.payload;
      return {
        ...state,
        podcastQuery,
        podcastFeedUrl: null
      };
    case 'setPodcastFeedUrl':
      const podcastFeedUrl = action.payload;
      return {
        ...state,
        podcastFeedUrl,
        podcastFeedData: null,
        // Reset the transient metadata about the currently playing episode and
        // listening history whenever the podcast feed changes
        nowPlaying: state.podcastFeedUrl !== podcastFeedUrl ?
          null :
          state.nowPlaying || null,
        viewingNowPlaying: false,
        listeningMetadata: state.podcastFeedUrl !== podcastFeedUrl ?
          {} :
          state.listeningMetadata || {}
      };
    case 'setPodcastImage':
      const podcastImage = action.payload;
      return { ...state, podcastImage };
    case 'setNowPlaying':
      const nowPlayingEpisodeGuid = action.payload;
      return {
        ...state,
        nowPlaying: state.podcastFeedData.item.find((episode) => episode.guid === nowPlayingEpisodeGuid),
        isPlaying: false,
        viewingNowPlaying: true
      };
    case 'setIsPlaying':
      const isPlaying = action.payload;
      return { ...state, isPlaying };
    case 'setViewingNowPlaying':
      const viewingNowPlaying = action.payload;
      return { ...state, viewingNowPlaying };
    case 'updateNowPlayingMetadata':
      const metadataEntry = action.payload;
      return {
        ...state,
        listeningMetadata: state.nowPlaying ?
          {
            ...state.listeningMetadata,
            [state.nowPlaying.guid]: { ...state.listeningMetadata[state.nowPlaying.guid], ...metadataEntry }
          } :
          state.listeningMetadata
      };
    default:
      return state;
  }
}
