// In order to prevent a NotImplemented error from jsdom, we cannot extend from
// `Audio`
class AudioMock {
  currentTime: number;
  duration: number;
  paused: boolean;
  _isAudioMock: true;
  _loaderPromise: Promise<void>;
  _callbackMap: { [key: string]: (() => void)[] };
  static instances: AudioMock[];

  constructor() {
    this.currentTime = 0;
    this.duration = NaN;
    this.paused = true;
    this._callbackMap = {};
    this._isAudioMock = true;
    AudioMock.instances.push(this);
    // Run callback asynchronously just like the real thing
    this._loaderPromise = Promise.resolve().then(() => {
      // Do not override duration if it was already set in a test
      this.duration = this.duration || 60;
      this.trigger('loadedmetadata');
      this.trigger('loadeddata');
    });
  }

  play() {
    this.paused = false;
    this.trigger('play');
  }

  pause() {
    this.paused = true;
    this.trigger('pause');
  }

  fastSeek() {
    // noop
  }

  trigger(eventName: string) {
    if (this._callbackMap[eventName]) {
      this._callbackMap[eventName].forEach((callback) => {
        callback();
      });
    }
  }

  addEventListener(eventType: string, eventCallback: (event?: any) => void) {
    if (!this._callbackMap[eventType]) {
      this._callbackMap[eventType] = [];
    }
    this._callbackMap[eventType].push(eventCallback);
    if (eventType === 'loadedmetadata' || eventType === 'loadeddata') {
      // Run callback asynchronously just like the real thing
      void this._loaderPromise.then(() => {
        setTimeout(() => {
          if (this._callbackMap[eventType].includes(eventCallback)) {
            eventCallback();
          }
        });
      });
    }
  }

  removeEventListener(eventName: string, eventCallback: (event?: any) => void) {
    if (!this._callbackMap[eventName]) {
      return;
    }
    const callbackIndex = this._callbackMap[eventName].indexOf(eventCallback);
    if (callbackIndex === -1) {
      return;
    }
    this._callbackMap[eventName].splice(callbackIndex, 1);
  }
}
// Keep track of all instances
AudioMock.instances = [];

export default AudioMock;
