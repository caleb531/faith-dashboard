// In order to prevent a NotImplemented error from jsdom, we cannot extend from
// `Audio`
class AudioMock {
  currentTime: number;
  duration: number;
  paused: boolean;
  _isAudioMock: true;
  callbackMap: { [key: string]: (() => void)[] };
  static instances: AudioMock[];

  constructor() {
    this.currentTime = 0;
    this.duration = 60;
    this.paused = true;
    this.callbackMap = {};
    this._isAudioMock = true;
    AudioMock.instances.push(this);
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
    if (this.callbackMap[eventName]) {
      this.callbackMap[eventName].forEach((callback) => {
        callback();
      });
    }
  }

  addEventListener(eventType: string, eventCallback: (event?: any) => void) {
    if (!this.callbackMap[eventType]) {
      this.callbackMap[eventType] = [];
    }
    this.callbackMap[eventType].push(eventCallback);
    if (eventType === 'loadeddata' || eventType === 'loadedmetadata') {
      setTimeout(() => {
        this.trigger(eventType);
      });
    }
  }

  removeEventListener(eventName: string) {
    if (this.callbackMap[eventName]) {
      this.callbackMap[eventName].length = 0;
    }
  }
}
// Keep track of all instances
AudioMock.instances = [];

export default AudioMock;
