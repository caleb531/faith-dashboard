export type MediaActionHandler = (args?: object) => void;

export const mediaSessionMock = {
  _metadata: null as MediaMetadataMock | null,
  _eventCallbacks: {} as {
    [key: string]: MediaActionHandler;
  },
  get metadata() {
    return this._metadata;
  },
  set metadata(newMetadata: MediaMetadataMock | null) {
    this._metadata = newMetadata;
    if (newMetadata === null) {
      Object.entries(this._eventCallbacks).forEach(([key, value]) => {
        delete this._eventCallbacks[key];
      });
    }
  },
  setActionHandler(action: string, handler: (args?: object) => void) {
    this._eventCallbacks[action] = handler;
  },
  _triggerAction(action: string) {
    if (this._eventCallbacks[action]) {
      this._eventCallbacks[action]();
    }
  }
};

export interface MediaImageMockType {
  src: string;
  type?: string;
  sizes?: string;
}

export class MediaMetadataMock {
  title: string;
  artist: string;
  album: string;
  artwork: MediaImageMockType[];
  constructor({
    title,
    artist,
    album,
    artwork
  }: {
    title: string;
    artist: string;
    album: string;
    artwork: MediaImageMockType[];
  }) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.artwork = artwork;
  }
}
